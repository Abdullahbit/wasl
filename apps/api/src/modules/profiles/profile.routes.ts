/**
 * Allows an authenticated user to create, update, and read their own profile.
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../../db/prisma.js';
import { validateRequest } from '../../middleware/validate.js';
import { ProfileInputSchema } from '@wasl/contracts';
import { asyncRoute } from '../../shared/utilities/asyncRoute.js';
import { ApplicationError } from '../../shared/errors/ApplicationError.js';
import { serializeProfile } from './profile.serializer.js';

const router = Router();


router.put(
  '/',
  validateRequest(ProfileInputSchema),
  asyncRoute(async (request: Request, response: Response) => {
    const profileData = ProfileInputSchema.parse(request.body);
    const profileId = request.headers['x-profile-id'] as string | undefined;
    
    let profile;
    if (profileId) {
      profile = await prisma.profile.update({
        where: { id: profileId },
        data: profileData,
      });
    } else {
      profile = await prisma.profile.create({
        data: profileData,
      });
    }

    response.json({ data: serializeProfile(profile) });
  }),
);

router.get(
  '/',
  asyncRoute(async (request: Request, response: Response) => {
    const profileId = request.headers['x-profile-id'] as string | undefined;
    
    if (!profileId) {
      throw new ApplicationError(400, 'BAD_REQUEST', 'Missing x-profile-id header.');
    }

    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      throw new ApplicationError(404, 'NOT_FOUND', 'Profile not found.');
    }

    response.json({ data: serializeProfile(profile) });
  }),
);

export default router;
