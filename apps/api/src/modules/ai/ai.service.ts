import * as profileService from '../profiles/profile.service.js'
import * as recommendationService from '../recommendations/recommendation.service.js'
import { createAiProvider, type AiProvider } from './ai.provider.js'
import { buildGroundedContext } from './ai.grounding.js'
import { validateGroundedResponse } from './ai.grounding.js'
import { env } from '../../config/env.js'
import { logger } from '../../config/logger.js'
import { prisma } from '../../db/client.js'

const AI_TIMEOUT_MS = 10_000

export interface NavigateResult {
  explanation: string
  navigationAdvice: string
  communities: unknown[]
  resources: unknown[]
  opportunities: unknown[]
  aiAvailable: boolean
}

function extractJson(raw: string): unknown {
  const trimmed = raw.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
  const candidate = fenced?.[1] ?? trimmed
  return JSON.parse(candidate)
}

async function recordUsageEvent(userId: string, succeeded: boolean): Promise<void> {
  try {
    await prisma.analyticsEvent.create({
      data: {
        userId,
        eventType: 'AI_NAVIGATE',
        properties: { succeeded },
      },
    })
  } catch (err) {
    // Analytics must never break the navigate flow.
    logger.warn({ err }, 'Failed to record AI_NAVIGATE analytics event')
  }
}

let cachedProvider: AiProvider | null | undefined

function getProvider(): AiProvider | null {
  if (cachedProvider !== undefined) {
    return cachedProvider
  }
  try {
    cachedProvider = createAiProvider({
      provider: env.AI_PROVIDER,
      apiKey: env.AI_PROVIDER_API_KEY,
      model: env.AI_MODEL,
    })
  } catch {
    cachedProvider = null
  }
  return cachedProvider
}

function toDeterministicResult(data: {
  communities: unknown[]
  resources: unknown[]
  opportunities: unknown[]
}): NavigateResult {
  return {
    explanation: '',
    navigationAdvice: '',
    communities: data.communities,
    resources: data.resources,
    opportunities: data.opportunities,
    aiAvailable: false,
  }
}

/**
 * Runs the AI navigator flow:
 *  1. load the user's profile
 *  2. run the deterministic recommendation engine to get grounded candidates
 *  3. ask the AI provider to explain/rank ONLY those candidates
 *  4. validate the AI's output against the approved entity IDs, dropping anything invented
 *  5. record a minimal, content-free analytics event
 *  6. return final entity details sourced from the DB, never from the AI
 *
 * If the AI call or parsing fails for any reason, falls back silently to the
 * deterministic recommendations with no AI explanation.
 */
export async function navigate(userId: string, _query: string): Promise<NavigateResult> {
  const profile = await profileService.getProfile(userId)

  const recommendations = await recommendationService.getRecommendations(userId)
  const { communities, resources, opportunities } = recommendations.data

  const approvedIds = new Set<string>([
    ...communities.map((c) => c.id),
    ...resources.map((r) => r.id),
    ...opportunities.map((o) => o.id),
  ])

  const provider = getProvider()
  if (!provider) {
    await recordUsageEvent(userId, false)
    return toDeterministicResult({ communities, resources, opportunities })
  }

  try {
    const systemPrompt = buildGroundedContext(
      {
        languages: profile?.languages ?? [],
        interests: profile?.interests ?? [],
        targetCountry: profile?.targetCountry,
      },
      communities.map((c) => ({ id: c.id, name: c.name, description: c.description, isVerified: c.isVerified })),
      resources.map((r) => ({ id: r.id, title: r.title, description: r.description, isVerified: r.isVerified })),
      opportunities.map((o) => ({ id: o.id, title: o.title, description: o.description, isVerified: o.isVerified })),
    )

    const raw = await provider.complete(systemPrompt, _query, { timeoutMs: AI_TIMEOUT_MS })
    const parsedJson = extractJson(raw)
    const validated = validateGroundedResponse(parsedJson, approvedIds)

    await recordUsageEvent(userId, true)

    const communityById = new Map(communities.map((c) => [c.id, c]))
    const resourceById = new Map(resources.map((r) => [r.id, r]))
    const opportunityById = new Map(opportunities.map((o) => [o.id, o]))

    return {
      explanation: validated.explanation,
      navigationAdvice: validated.navigationAdvice,
      communities: validated.rankedCommunities
        .map((ref) => communityById.get(ref.id))
        .filter((c): c is NonNullable<typeof c> => c !== undefined),
      resources: validated.rankedResources
        .map((ref) => resourceById.get(ref.id))
        .filter((r): r is NonNullable<typeof r> => r !== undefined),
      opportunities: validated.rankedOpportunities
        .map((ref) => opportunityById.get(ref.id))
        .filter((o): o is NonNullable<typeof o> => o !== undefined),
      aiAvailable: true,
    }
  } catch (err) {
    logger.warn({ err: err instanceof Error ? err.message : 'unknown' }, 'AI navigate failed, falling back')
    await recordUsageEvent(userId, false)
    return toDeterministicResult({ communities, resources, opportunities })
  }
}
