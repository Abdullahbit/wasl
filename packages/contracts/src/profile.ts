/**
 * Defines onboarding profile payloads exchanged between the web and API apps.
 */

import { z } from 'zod';

export const ArrivalStageSchema = z.enum([
  'Preparing',
  'First Week',
  'First Month',
  'Settled'
]);

export const ProfileInputSchema = z.object({
  city: z.string().trim().min(1, 'City is required').max(100),
  university: z.string().trim().min(1, 'University is required').max(200),
  arrivalStage: ArrivalStageSchema,
  turkishLevel: z.enum(['None', 'Beginner', 'Intermediate', 'Advanced', 'Native']),
  specialization: z.string().trim().min(1, 'Specialization is required').max(150),
  interests: z.array(z.string().trim().min(1).max(100)).max(20).default([]),
  goals: z.array(z.string().trim().min(1).max(100)).max(20).default([]),
});

export const ProfileResponseSchema = ProfileInputSchema.extend({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const ProfileDataResponseSchema = z.object({
  data: ProfileResponseSchema,
});

export type ProfileInput = z.infer<typeof ProfileInputSchema>;
export type ProfileResponse = z.infer<typeof ProfileResponseSchema>;
export type ProfileDataResponse = z.infer<typeof ProfileDataResponseSchema>;
