/**
 * Allows an authenticated user to create, update, and read their own profile.
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../../db/prisma.js';
import { validateRequest } from '../../middleware/validate.js';
import { ProfileInputSchema } from '@wasl/contracts';
import { requireAuthenticatedUser } from '../auth/auth.middleware.js';
import { asyncRoute } from '../../shared/utilities/asyncRoute.js';
import { ApplicationError } from '../../shared/errors/ApplicationError.js';
import { serializeProfile } from './profile.serializer.js';

const router = Router();

router.use(requireAuthenticatedUser);

router.put(
  '/',
  validateRequest(ProfileInputSchema),
  asyncRoute(async (request: Request, response: Response) => {
    const profileData = ProfileInputSchema.parse(request.body);
    const userId = response.locals.session.user.id as string;
    const profile = await prisma.profile.upsert({
      where: { userId },
      update: profileData,
      create: { ...profileData, userId },
    });

    response.json({ data: serializeProfile(profile) });
  }),
);

router.get(
  '/',
  asyncRoute(async (_request: Request, response: Response) => {
    const userId = response.locals.session.user.id as string;
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new ApplicationError(404, 'NOT_FOUND', 'Profile not found.');
    }

    response.json({ data: serializeProfile(profile) });
  }),
);

export default router;
