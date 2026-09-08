/**
 * Defines verified opportunity records exposed by the opportunity API.
 */

import { z } from 'zod';

export const OpportunitySchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  city: z.string().nullable(),
  url: z.string().url(),
  deadline: z.string().datetime().nullable(),
  verified: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const OpportunityListResponseSchema = z.object({
  data: z.array(OpportunitySchema),
  meta: z.object({ total: z.number().int().nonnegative() }),
});

export const OpportunityFiltersSchema = z.object({
  city: z.string().trim().min(1).optional(),
  category: z.string().trim().min(1).optional(),
});

export type Opportunity = z.infer<typeof OpportunitySchema>;
export type OpportunityListResponse = z.infer<typeof OpportunityListResponseSchema>;
export type OpportunityFilters = z.infer<typeof OpportunityFiltersSchema>;
