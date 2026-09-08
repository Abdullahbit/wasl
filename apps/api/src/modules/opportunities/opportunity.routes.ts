/**
 * Exposes filterable, verified opportunities without allowing browser-side database access.
 */

import { Router, type Request, type Response } from 'express';
import { OpportunityFiltersSchema } from '@wasl/contracts';
import { prisma } from '../../db/prisma.js';
import { validateQuery } from '../../middleware/validate.js';
import { asyncRoute } from '../../shared/utilities/asyncRoute.js';

const router = Router();

router.get(
  '/',
  validateQuery(OpportunityFiltersSchema),
  asyncRoute(async (request: Request, response: Response) => {
    const { city, category } = OpportunityFiltersSchema.parse(request.query);
    const opportunities = await prisma.opportunity.findMany({
      where: {
        verified: true,
        ...(city ? { city: { equals: city, mode: 'insensitive' } } : {}),
        ...(category ? { category: { equals: category, mode: 'insensitive' } } : {}),
      },
      orderBy: [{ deadline: 'asc' }, { createdAt: 'desc' }],
    });

    response.json({
      data: opportunities.map((opportunity) => ({
        ...opportunity,
        deadline: opportunity.deadline?.toISOString() ?? null,
        createdAt: opportunity.createdAt.toISOString(),
        updatedAt: opportunity.updatedAt.toISOString(),
      })),
      meta: { total: opportunities.length },
    });
  }),
);

export default router;
