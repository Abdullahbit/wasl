import { z } from 'zod'

/**
 * Zod schema for validating raw structured output returned by the AI provider.
 * This is intentionally separate from `@platform/contracts` NavigateResponseSchema:
 * this schema validates the *untrusted* shape coming back from the model before
 * any grounding checks are applied, while the contracts schema describes the
 * shape of the API's final, validated response to the client.
 */
export const AiEntityRefSchema = z.object({
  id: z.string().min(1),
  reason: z.string().min(1),
})

export const AiOutputSchema = z.object({
  explanation: z.string().min(1),
  rankedCommunities: z.array(AiEntityRefSchema).default([]),
  rankedResources: z.array(AiEntityRefSchema).default([]),
  rankedOpportunities: z.array(AiEntityRefSchema).default([]),
  navigationAdvice: z.string().min(1),
})

export type AiEntityRef = z.infer<typeof AiEntityRefSchema>
export type AiOutput = z.infer<typeof AiOutputSchema>
