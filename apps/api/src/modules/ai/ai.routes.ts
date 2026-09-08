/**
 * Exposes rate-limited AI navigation for the authenticated user's grounded profile.
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../../db/prisma.js';
import { validateRequest } from '../../middleware/validate.js';
import { RecommendationRequestSchema } from '@wasl/contracts';
import { generateRecommendations } from './ai.service.js';
import { aiRateLimit } from '../../middleware/rateLimit.js';
import { asyncRoute } from '../../shared/utilities/asyncRoute.js';
import { ApplicationError } from '../../shared/errors/ApplicationError.js';

const router = Router();

router.post(
  '/navigate',
  aiRateLimit,
  validateRequest(RecommendationRequestSchema),
  asyncRoute(async (request: Request, response: Response) => {
    const profileId = request.headers['x-profile-id'] as string | undefined;
    
    if (!profileId) {
      throw new ApplicationError(400, 'BAD_REQUEST', 'Missing x-profile-id header.');
    }

    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      throw new ApplicationError(409, 'PROFILE_REQUIRED', 'Complete onboarding first.');
    }

    const communities = await prisma.community.findMany({ where: { verified: true } });

    const result = await generateRecommendations(profile, communities);

    response.json({ data: result });
  }),
);

export default router;
