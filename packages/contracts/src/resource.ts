/**
 * Defines curated resource records returned by the public resource API.
 */

import { z } from 'zod';

export const ResourceSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  url: z.string().url(),
  source: z.string(),
  lastReviewed: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const ResourceListResponseSchema = z.object({
  data: z.array(ResourceSchema),
  meta: z.object({ total: z.number().int().nonnegative() }),
});

export const ResourceDataResponseSchema = z.object({ data: ResourceSchema });

export const ResourceFiltersSchema = z.object({
  category: z.string().trim().min(1).optional(),
});

export type Resource = z.infer<typeof ResourceSchema>;
export type ResourceListResponse = z.infer<typeof ResourceListResponseSchema>;
export type ResourceDataResponse = z.infer<typeof ResourceDataResponseSchema>;
export type ResourceFilters = z.infer<typeof ResourceFiltersSchema>;
