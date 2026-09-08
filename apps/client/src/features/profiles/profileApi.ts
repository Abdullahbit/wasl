/**
 * Owns profile query keys and transport calls for the onboarding feature.
 */

import { ProfileDataResponseSchema, type ProfileInput } from '@wasl/contracts';
import { apiRequest } from '../../lib/apiClient';

export const profileQueryKey = ['profile'] as const;

export function saveProfile(profileInput: ProfileInput) {
  return apiRequest('/api/v1/profile', ProfileDataResponseSchema, {
    method: 'PUT',
    body: profileInput,
  });
}
