/**
 * Exposes read-only, filterable access to approved community records.
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../../db/prisma.js';
import { CommunityFiltersSchema, IdentifierParametersSchema } from '@wasl/contracts';
import { validateParams, validateQuery } from '../../middleware/validate.js';
import { asyncRoute } from '../../shared/utilities/asyncRoute.js';
import { ApplicationError } from '../../shared/errors/ApplicationError.js';
import { serializeCommunity } from './community.serializer.js';

const router = Router();

router.get(
  '/',
  validateQuery(CommunityFiltersSchema),
  asyncRoute(async (request: Request, response: Response) => {
    const { city, category, language, verified } = CommunityFiltersSchema.parse(request.query);
    const communities = await prisma.community.findMany({
      where: {
        ...(city ? { location: { equals: city, mode: 'insensitive' } } : {}),
        ...(category ? { category: { equals: category, mode: 'insensitive' } } : {}),
        ...(language ? { languages: { has: language } } : {}),
        ...(verified ? { verified: verified === 'true' } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });

    response.json({
      data: communities.map(serializeCommunity),
      meta: { total: communities.length },
    });
  }),
);

router.get(
  '/:id',
  validateParams(IdentifierParametersSchema),
  asyncRoute(async (request: Request, response: Response) => {
    const { id } = IdentifierParametersSchema.parse(request.params);
    const community = await prisma.community.findUnique({
      where: { id },
    });

    if (!community) {
      throw new ApplicationError(404, 'NOT_FOUND', 'Community not found.');
    }

    response.json({ data: serializeCommunity(community) });
  }),
);

export default router;
