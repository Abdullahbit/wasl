import { z } from 'zod'
import { CommunityResponseSchema } from './community.js'
import { ResourceResponseSchema } from './resource.js'
import { OpportunityResponseSchema } from './opportunity.js'

export const RecommendationResponseSchema = z.object({
  communities: z.array(CommunityResponseSchema.extend({ score: z.number() })),
  resources: z.array(ResourceResponseSchema.extend({ score: z.number() })),
  opportunities: z.array(OpportunityResponseSchema.extend({ score: z.number() })),
})

export type RecommendationResponse = z.infer<typeof RecommendationResponseSchema>
