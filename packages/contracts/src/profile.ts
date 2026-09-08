import { z } from 'zod';

export const ArrivalStageSchema = z.enum([
  'Preparing',
  'First Week',
  'First Month',
  'Settled'
]);

export const ProfileInputSchema = z.object({
  city: z.string().min(1, 'City is required'),
  university: z.string().min(1, 'University is required'),
  arrivalStage: ArrivalStageSchema,
  turkishLevel: z.enum(['None', 'Beginner', 'Intermediate', 'Advanced', 'Native']),
  specialization: z.string().min(1, 'Specialization is required'),
  interests: z.array(z.string()).default([]),
  goals: z.array(z.string()).default([]),
});

export const ProfileResponseSchema = ProfileInputSchema.extend({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type ProfileInput = z.infer<typeof ProfileInputSchema>;
export type ProfileResponse = z.infer<typeof ProfileResponseSchema>;
