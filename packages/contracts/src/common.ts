/**
 * Defines response envelopes and reusable validation primitives for the API.
 */

import { z } from 'zod';

export const IdentifierParametersSchema = z.object({
  id: z.string().uuid(),
});

export const PaginationMetaSchema = z.object({
  total: z.number().int().nonnegative(),
});

export const ErrorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
    requestId: z.string().optional(),
  }),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
