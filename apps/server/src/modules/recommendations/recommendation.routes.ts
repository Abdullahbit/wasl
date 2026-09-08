/**
 * Returns deterministic recommendations for the authenticated user's profile.
 *
 * Controller is thin: delegates scoring and ranking to recommendation.service.
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../../db/prisma.js';
import { requireAuthenticatedUser } from '../auth/auth.middleware.js';
import { ApplicationError } from '../../shared/errors/ApplicationError.js';
import { asyncRoute } from '../../shared/utilities/asyncRoute.js';
import { scoreCommunity } from './recommendation.service.js';
import { serializeCommunity } from '../communities/community.serializer.js';

const router = Router();

const DEFAULT_TOP_N = 5;

router.get(
  '/',
  requireAuthenticatedUser,
  asyncRoute(async (_request: Request, response: Response) => {
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
  }),
);

export default router;
