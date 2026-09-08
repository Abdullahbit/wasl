/**
 * Owns community query keys and validated discovery transport calls.
 *
 * Filters for category/language are sent server-side; university is filtered
 * client-side because the backend contract does not yet expose it as a query
 * filter. The isolation keeps fetch logic out of components.
 */

import { CommunityDataResponseSchema, CommunityListResponseSchema, type CommunityFilters } from '@wasl/contracts';
import { apiRequest } from '../../lib/apiClient';

export const communityQueryKeys = {
  all: ['communities'] as const,
  list: (filters: CommunityFilters = {}) => ['communities', filters] as const,
  detail: (id: string) => ['communities', id] as const,
};

export function getCommunities(filters: CommunityFilters = {}, signal?: AbortSignal) {
  const searchParameters = new URLSearchParams();

  if (filters.city) searchParameters.set('city', filters.city);
  if (filters.category) searchParameters.set('category', filters.category);
  if (filters.language) searchParameters.set('language', filters.language);
  if (filters.verified) searchParameters.set('verified', filters.verified);

  const queryString = searchParameters.toString();
  const path = queryString ? `/api/v1/communities?${queryString}` : '/api/v1/communities';

  return apiRequest(path, CommunityListResponseSchema, {
    ...(signal ? { signal } : {}),
  });
}

export function getCommunity(communityId: string, signal?: AbortSignal) {
  return apiRequest(`/api/v1/communities/${communityId}`, CommunityDataResponseSchema, {
    ...(signal ? { signal } : {}),
  });
}
