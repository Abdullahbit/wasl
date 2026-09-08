/**
 * Exposes rate-limited AI navigation for the authenticated user's grounded profile.
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../../db/prisma.js';
import { validateRequest } from '../../middleware/validate.js';
import { RecommendationRequestSchema } from '@wasl/contracts';
import { generateRecommendations } from './ai.service.js';
import { requireAuthenticatedUser } from '../auth/auth.middleware.js';
import { aiRateLimit } from '../../middleware/rateLimit.js';
import { asyncRoute } from '../../shared/utilities/asyncRoute.js';
import { ApplicationError } from '../../shared/errors/ApplicationError.js';

const router = Router();

router.post(
  '/navigate',
  aiRateLimit,
  requireAuthenticatedUser,
  validateRequest(RecommendationRequestSchema),
  asyncRoute(async (_request: Request, response: Response) => {
    const userId = response.locals.session.user.id as string;
    const profile = await prisma.profile.findUnique({
      where: { userId },
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
