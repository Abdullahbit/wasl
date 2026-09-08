import { z } from 'zod'
import { PaginationSchema } from './common.js'

export const CommunityFiltersSchema = PaginationSchema.extend({
  categoryId: z.string().optional(),
  languageId: z.string().optional(),
  interestId: z.string().optional(),
  search: z.string().max(100).optional(),
})

export const CommunityResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  websiteUrl: z.string().nullable(),
  contactEmail: z.string().nullable(),
  joinUrl: z.string().nullable(),
  memberCount: z.number().nullable(),
  isVerified: z.boolean(),
  verificationStatus: z.string().nullable(),
  category: z.object({ id: z.string(), name: z.string(), slug: z.string() }).nullable(),
  languages: z.array(z.object({ id: z.string(), code: z.string(), name: z.string() })),
  interests: z.array(z.object({ id: z.string(), name: z.string(), slug: z.string() })),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type CommunityFilters = z.infer<typeof CommunityFiltersSchema>
export type CommunityResponse = z.infer<typeof CommunityResponseSchema>
