/**
 * Owns recommendation query keys and transport calls for the personalized plan.
 *
 * The plan prefers the grounded AI navigator (POST /api/v1/ai/navigate) and
 * falls back to deterministic recommendations (GET /api/v1/recommendations).
 * Both are isolated here so pages never contain raw fetch logic.
 */

import { DeterministicRecommendationSchema, RecommendationDataResponseSchema, type RecommendationResponse } from '@wasl/contracts';
import { z } from 'zod';
import { apiRequest } from '../../lib/apiClient';

export const recommendationQueryKeys = {
  all: ['recommendations'] as const,
  navigator: ['recommendations', 'navigator'] as const,
  deterministic: ['recommendations', 'deterministic'] as const,
};

/**
 * Fetches the grounded AI navigator response that contains personalized next steps.
 * Returns the full RecommendationResponse including deterministic candidates and optional navigator.
 */
export function getNavigatorRecommendations(signal?: AbortSignal): Promise<RecommendationResponse> {
  return apiRequest('/api/v1/ai/navigate', RecommendationDataResponseSchema, {
    method: 'POST',
    body: {},
    ...(signal ? { signal } : {}),
  }).then((response) => response.data);
}

/**
 * Fetches deterministic scored communities when AI is unavailable or for direct use.
 * The server returns { data: DeterministicRecommendation[], meta: { total } }.
 */
const DeterministicListResponseSchema = z.object({
  data: z.array(DeterministicRecommendationSchema),
  meta: z.object({ total: z.number().int().nonnegative() }),
});

export function getDeterministicRecommendations(signal?: AbortSignal) {
  return apiRequest('/api/v1/recommendations', DeterministicListResponseSchema, {
    method: 'GET',
    ...(signal ? { signal } : {}),
  });
}

export type DeterministicRecommendationListResponse = z.infer<typeof DeterministicListResponseSchema>;
