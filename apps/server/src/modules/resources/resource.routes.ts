/**
 * Exposes read-only, filterable access to curated resource records.
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../../db/prisma.js';
import { IdentifierParametersSchema, ResourceFiltersSchema } from '@wasl/contracts';
import { validateParams, validateQuery } from '../../middleware/validate.js';
import { asyncRoute } from '../../shared/utilities/asyncRoute.js';
import { ApplicationError } from '../../shared/errors/ApplicationError.js';
import { serializeResource } from './resource.serializer.js';

const router = Router();

router.get(
  '/',
  validateQuery(ResourceFiltersSchema),
  asyncRoute(async (request: Request, response: Response) => {
    const { category } = ResourceFiltersSchema.parse(request.query);
    const resources = await prisma.resource.findMany({
      ...(category ? { where: { category: { equals: category, mode: 'insensitive' as const } } } : {}),
      orderBy: { createdAt: 'desc' },
    });

    response.json({
      data: resources.map(serializeResource),
      meta: { total: resources.length },
    });
  }),
);

router.get(
  '/:id',
  validateParams(IdentifierParametersSchema),
  asyncRoute(async (request: Request, response: Response) => {
    const { id } = IdentifierParametersSchema.parse(request.params);
    const resource = await prisma.resource.findUnique({
      where: { id },
    });

    if (!resource) {
      throw new ApplicationError(404, 'NOT_FOUND', 'Resource not found.');
    }

    response.json({ data: serializeResource(resource) });
  }),
);

export default router;
