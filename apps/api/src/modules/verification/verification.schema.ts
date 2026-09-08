import { z } from 'zod'

export const VerificationEntityType = z.enum([
  'RESOURCE',
  'OPPORTUNITY',
  'COMMUNITY',
])

export const VerificationParamsSchema = z.object({
  entityType: VerificationEntityType,
  entityId: z.string().min(1),
})

export const VerifyEntityBodySchema = z.object({
  notes: z.string().max(2000).optional(),
})

export type VerificationParams = z.infer<typeof VerificationParamsSchema>
export type VerifyEntityBody = z.infer<typeof VerifyEntityBodySchema>
