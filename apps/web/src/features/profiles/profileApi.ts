/**
 * Owns profile query keys, identity token handling, and transport calls for the profile and onboarding features.
 */

import { ProfileDataResponseSchema, type ProfileInput } from '@wasl/contracts';
import { apiRequest } from '../../lib/apiClient';

export const profileQueryKey = ['profile'] as const;

const PROFILE_ID_STORAGE_KEY = 'wasl_active_profile_id';

export function getActiveProfileId(): string | null {
  try {
    return localStorage.getItem(PROFILE_ID_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setActiveProfileId(id: string | null): void {
  try {
    if (id) {
      localStorage.setItem(PROFILE_ID_STORAGE_KEY, id);
    } else {
      localStorage.removeItem(PROFILE_ID_STORAGE_KEY);
    }
  } catch {
    // Gracefully ignore local storage quota / access errors
  }
}

export function getProfile(profileId?: string | null) {
  const effectiveId = profileId ?? getActiveProfileId();
  const headers: Record<string, string> = {};
  if (effectiveId) {
    headers['x-profile-id'] = effectiveId;
  }

  return apiRequest('/api/v1/profile', ProfileDataResponseSchema, {
    method: 'GET',
    headers,
  });
}

export async function saveProfile(profileInput: ProfileInput, profileId?: string | null) {
  const effectiveId = profileId ?? getActiveProfileId();
  const headers: Record<string, string> = {};
  if (effectiveId) {
    headers['x-profile-id'] = effectiveId;
  }

  const result = await apiRequest('/api/v1/profile', ProfileDataResponseSchema, {
    method: 'PUT',
    body: profileInput,
    headers,
  });

  if (result?.data?.id) {
    setActiveProfileId(result.data.id);
  }

  return result;
}

