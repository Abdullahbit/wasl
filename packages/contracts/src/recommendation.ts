import { z } from 'zod';
import { CommunitySchema } from './community';

export const RecommendationRequestSchema = z.object({
  profileId: z.string().uuid(),
});

export const RecommendationScoreSchema = z.object({
  score: z.number(),
  breakdown: z.record(z.string(), z.number()), // e.g., { "University match": 30 }
});

export const DeterministicRecommendationSchema = z.object({
  communityId: z.string().uuid(),
  community: CommunitySchema,
  score: RecommendationScoreSchema,
});

export const AIRecommendationStepSchema = z.object({
  title: z.string(),
  description: z.string(),
  priority: z.enum(['High', 'Medium', 'Low']),
  reason: z.string(),
  relatedCommunityId: z.string().uuid().optional(),
  relatedResourceId: z.string().uuid().optional(),
});

export const NavigatorResponseSchema = z.object({
  summary: z.string(),
  nextSteps: z.array(AIRecommendationStepSchema),
});

export const RecommendationResponseSchema = z.object({
  navigator: NavigatorResponseSchema.optional(), // Might be omitted if AI fails
  deterministic: z.array(DeterministicRecommendationSchema),
  error: z.string().optional(), // If AI fallback happened
});

export type RecommendationRequest = z.infer<typeof RecommendationRequestSchema>;
export type DeterministicRecommendation = z.infer<typeof DeterministicRecommendationSchema>;
export type RecommendationScore = z.infer<typeof RecommendationScoreSchema>;
export type AIRecommendationStep = z.infer<typeof AIRecommendationStepSchema>;
export type NavigatorResponse = z.infer<typeof NavigatorResponseSchema>;
export type RecommendationResponse = z.infer<typeof RecommendationResponseSchema>;
