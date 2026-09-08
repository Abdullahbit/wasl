import { z } from 'zod'

export const NavigateRequestSchema = z.object({
  query: z.string().min(1).max(500),
})

export const AiEntityRefSchema = z.object({
  id: z.string(),
  reason: z.string(),
})

export const NavigateResponseSchema = z.object({
  explanation: z.string(),
  navigationAdvice: z.string(),
  rankedCommunities: z.array(AiEntityRefSchema),
  rankedResources: z.array(AiEntityRefSchema),
  rankedOpportunities: z.array(AiEntityRefSchema),
})

export type NavigateRequest = z.infer<typeof NavigateRequestSchema>
export type NavigateResponse = z.infer<typeof NavigateResponseSchema>
