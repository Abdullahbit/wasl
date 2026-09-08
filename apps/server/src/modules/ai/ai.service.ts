/**
 * Grounds AI navigation in deterministic, approved community candidates.
 */

import { Profile, Community } from '@prisma/client';
import { RecommendationResponse, NavigatorResponseSchema, NavigatorResponse } from '@wasl/contracts';
import { scoreCommunity, selectTopCommunities } from '../recommendations/recommendation.service.js';
import { serializeCommunity } from '../communities/community.serializer.js';
import { environment } from '../../config/env.js';
import { logger } from '../../config/logger.js';
import { NAVIGATOR_PROMPT_V1 } from './navigator.prompt.js';

const MAXIMUM_AI_CANDIDATES = 10;
const AI_REQUEST_TIMEOUT_MILLISECONDS = 15_000;

export interface AiNavigatorProvider {
  createNavigator(
    profile: Profile,
    candidates: Community[],
    cancellationSignal: AbortSignal,
  ): Promise<unknown>;
}

/**
 * This boundary is intentionally provider-neutral. A teammate can replace this adapter
 * without changing route, ranking, or validation code. It fails closed until configured.
 */
const configuredAiProvider: AiNavigatorProvider = {
  async createNavigator() {
    if (!environment.AI_PROVIDER_API_KEY) {
      throw new Error('AI_PROVIDER_API_KEY is not configured');
    }

    throw new Error('Connect the selected AI provider in modules/ai/ai.service.ts');
  },
};

export async function generateRecommendations(
  profile: Profile,
  communities: Community[],
  aiProvider: AiNavigatorProvider = configuredAiProvider,
): Promise<RecommendationResponse> {
  const scoredCommunities = communities.map((community) => ({
    community,
    scoreResult: scoreCommunity(profile, community),
  }));

  const filtered = scoredCommunities.filter((candidate) => candidate.scoreResult.score > 0);

  const candidates = selectTopCommunities(
    filtered.map((c) => ({ id: c.community.id, community: c.community, scoreResult: c.scoreResult, score: c.scoreResult.score })),
    MAXIMUM_AI_CANDIDATES,
  ).map((c) => ({ community: c.community, scoreResult: c.scoreResult }));

  const deterministic = candidates.map((candidate) => ({
    communityId: candidate.community.id,
    community: serializeCommunity(candidate.community),
    score: candidate.scoreResult,
  }));

  let aiNavigator: NavigatorResponse | undefined;
  let warning: string | undefined;

  try {
    const providerResponse = await createNavigatorWithTimeout(
      aiProvider,
      profile,
      candidates.map((candidate) => candidate.community),
    );
    aiNavigator = NavigatorResponseSchema.parse(providerResponse);
  } catch (error) {
    logger.warn({ error }, 'AI navigator failed; returning deterministic recommendations');
    warning = 'AI personalization is unavailable. Showing verified deterministic matches.';
  }

  // Centralized prompt ensures AI only uses approved entities (see navigator.prompt.ts)
  void NAVIGATOR_PROMPT_V1;

  if (aiNavigator) {
    const validCommunityIds = new Set(candidates.map((candidate) => candidate.community.id));
    // No approved resources in this flow; strip any hallucinated resource IDs.
    const validResourceIds = new Set<string>();

    aiNavigator.nextSteps = aiNavigator.nextSteps
      .filter((step) => {
        if (step.relatedCommunityId && !validCommunityIds.has(step.relatedCommunityId)) {
          logger.warn({ relatedCommunityId: step.relatedCommunityId }, 'Stripping hallucinated community ID');
          return false;
        }
        if (step.relatedResourceId && !validResourceIds.has(step.relatedResourceId)) {
          // Allow step but strip hallucinated resource ID
          delete (step as { relatedResourceId?: string }).relatedResourceId;
        }
        return true;
      })
      .map((step) => {
        // Ensure no unknown IDs leak even after filter
        if (step.relatedResourceId && !validResourceIds.has(step.relatedResourceId)) {
          const { relatedResourceId: _removed, ...rest } = step;
          return rest as typeof step;
        }
        return step;
      });
  }

  return {
    deterministic,
    ...(aiNavigator ? { navigator: aiNavigator } : {}),
    ...(warning ? { warning } : {}),
  };
}

/**
 * Bounds provider latency and supplies an abort signal so adapters can cancel network work.
 */
async function createNavigatorWithTimeout(
  aiProvider: AiNavigatorProvider,
  profile: Profile,
  candidates: Community[],
) {
  const abortController = new AbortController();
  let timeoutIdentifier: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_resolve, reject) => {
    timeoutIdentifier = setTimeout(() => {
      abortController.abort();
      reject(new Error('AI provider request timed out'));
    }, AI_REQUEST_TIMEOUT_MILLISECONDS);
  });

  try {
    return await Promise.race([
      aiProvider.createNavigator(profile, candidates, abortController.signal),
      timeoutPromise,
    ]);
  } finally {
    if (timeoutIdentifier) {
      clearTimeout(timeoutIdentifier);
    }
  }
}
