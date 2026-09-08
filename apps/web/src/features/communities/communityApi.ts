/**
 * Owns community query keys and validated discovery transport calls.
 */

import { CommunityListResponseSchema } from '@wasl/contracts';
import { apiRequest } from '../../lib/apiClient';

export const communityQueryKeys = {
  all: ['communities'] as const,
  list: (city: string | null) => ['communities', { city }] as const,
};

export function getCommunities(city: string | null) {
  const query = city ? `?city=${encodeURIComponent(city)}` : '';
  return apiRequest(`/api/v1/communities${query}`, CommunityListResponseSchema);
}
