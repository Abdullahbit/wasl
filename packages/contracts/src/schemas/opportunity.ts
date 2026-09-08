import { z } from 'zod'
import { PaginationSchema } from './common.js'

export const OpportunityType = z.enum(['JOB', 'SCHOLARSHIP', 'GRANT', 'INTERNSHIP', 'PROGRAM'])

export const OpportunityFiltersSchema = PaginationSchema.extend({
  type: OpportunityType.optional(),
  interestId: z.string().optional(),
  targetCountry: z.string().optional(),
  search: z.string().max(100).optional(),
})

export const OpportunityResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  type: OpportunityType,
  organizationName: z.string(),
  applicationUrl: z.string().nullable(),
  deadline: z.string().nullable(),
  isVerified: z.boolean(),
  targetCountry: z.string().nullable(),
  requirements: z.string().nullable(),
  interests: z.array(z.object({ id: z.string(), name: z.string() })),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type OpportunityFilters = z.infer<typeof OpportunityFiltersSchema>
export type OpportunityResponse = z.infer<typeof OpportunityResponseSchema>
