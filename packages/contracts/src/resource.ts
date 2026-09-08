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
  total: z.number(),
});

export type Resource = z.infer<typeof ResourceSchema>;
export type ResourceListResponse = z.infer<typeof ResourceListResponseSchema>;
