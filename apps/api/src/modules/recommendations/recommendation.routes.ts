/**
 * Returns deterministic recommendations for the authenticated user's profile.
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../../db/prisma.js';
import { ApplicationError } from '../../shared/errors/ApplicationError.js';
import { asyncRoute } from '../../shared/utilities/asyncRoute.js';
import { scoreCommunity } from './recommendation.service.js';
import { serializeCommunity } from '../communities/community.serializer.js';

const router = Router();

router.get(
  '/',
  asyncRoute(async (request: Request, response: Response) => {
    const profileId = request.headers['x-profile-id'] as string | undefined;
    
    if (!profileId) {
      throw new ApplicationError(400, 'BAD_REQUEST', 'Missing x-profile-id header.');
    }

    const profile = await prisma.profile.findUnique({ where: { id: profileId } });

    if (!profile) {
      throw new ApplicationError(409, 'PROFILE_REQUIRED', 'Complete onboarding first.');
    }

    const communities = await prisma.community.findMany({ where: { verified: true } });
    const recommendations = communities
      .map((community) => ({
        communityId: community.id,
        community: serializeCommunity(community),
        score: scoreCommunity(profile, community),
      }))
      .filter((recommendation) => recommendation.score.score > 0)
      .sort((first, second) => second.score.score - first.score.score);

    response.json({ data: recommendations, meta: { total: recommendations.length } });
  }),
);

export default router;
