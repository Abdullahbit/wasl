/**
 * Returns deterministic recommendations for the authenticated user's profile.
 *
 * Controller is thin: delegates scoring and ranking to recommendation.service.
 * Supports both GET (legacy) and POST (Team Task 02 required) via shared service.
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../../db/prisma.js';
import { requireAuthenticatedUser } from '../auth/auth.middleware.js';
import { ApplicationError } from '../../shared/errors/ApplicationError.js';
import { asyncRoute } from '../../shared/utilities/asyncRoute.js';
import { scoreCommunity } from './recommendation.service.js';
import { serializeCommunity } from '../communities/community.serializer.js';
import { RecommendationRequestSchema } from '@wasl/contracts';

const router = Router();

const DEFAULT_TOP_N = 5;

async function handleRecommendations(_request: Request, response: Response) {
  const userId = response.locals.session.user.id as string;
  const profile = await prisma.profile.findUnique({ where: { userId } });

  if (!profile) {
    throw new ApplicationError(409, 'PROFILE_REQUIRED', 'Complete onboarding first.');
  }

  const communities = await prisma.community.findMany({ where: { verified: true } });

  const scored = communities
    .map((community) => ({
      communityId: community.id,
      community: serializeCommunity(community),
      score: scoreCommunity(profile, community),
    }))
    .filter((recommendation) => recommendation.score.score > 0);

  const recommendations = [...scored]
    .sort((a, b) => {
      if (b.score.score !== a.score.score) return b.score.score - a.score.score;
      return a.communityId.localeCompare(b.communityId);
    })
    .slice(0, DEFAULT_TOP_N);

  response.json({ data: recommendations, meta: { total: recommendations.length } });
}

router.get('/', requireAuthenticatedUser, asyncRoute(handleRecommendations));

router.post(
  '/',
  requireAuthenticatedUser,
  asyncRoute(async (request: Request, response: Response) => {
    const parsed = RecommendationRequestSchema.safeParse(request.body ?? {});
    if (!parsed.success) {
      throw new ApplicationError(400, 'VALIDATION_ERROR', 'Invalid recommendation request');
    }
    return handleRecommendations(request, response);
  }),
);

export default router;
