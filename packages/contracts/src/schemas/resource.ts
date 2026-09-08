import { z } from 'zod'
import { PaginationSchema } from './common.js'

export const ResourceType = z.enum(['ARTICLE', 'VIDEO', 'GUIDE', 'TOOL', 'WEBSITE'])

export const ResourceFiltersSchema = PaginationSchema.extend({
  categoryId: z.string().optional(),
  interestId: z.string().optional(),
  type: ResourceType.optional(),
  search: z.string().max(100).optional(),
})

export const ResourceResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  url: z.string(),
  type: ResourceType,
  isVerified: z.boolean(),
  verificationStatus: z.string().nullable(),
  category: z.object({ id: z.string(), name: z.string() }).nullable(),
  interests: z.array(z.object({ id: z.string(), name: z.string() })),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type ResourceFilters = z.infer<typeof ResourceFiltersSchema>
export type ResourceResponse = z.infer<typeof ResourceResponseSchema>
