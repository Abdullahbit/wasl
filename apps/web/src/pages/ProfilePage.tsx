/**
 * Primary WASL Profile page.
 * Fetches the user profile from the backend, renders view mode by default,
 * supports seamless switching to edit mode, validates updates with ProfileInputSchema,
 * and updates TanStack Query cache.
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProfileInput } from '@wasl/contracts';
import { getProfile, saveProfile, getActiveProfileId, profileQueryKey } from '../features/profiles/profileApi';
import { ProfileView } from '../features/profiles/ProfileView';
import { ProfileForm } from '../features/profiles/ProfileForm';
import { ProfileLoadingState } from '../features/profiles/ProfileLoadingState';
import { ProfileErrorState } from '../features/profiles/ProfileErrorState';
import { ApiError } from '../lib/apiClient';

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const activeId = getActiveProfileId();

  const profileQuery = useQuery({
    queryKey: profileQueryKey,
    queryFn: () => getProfile(activeId),
    enabled: !!activeId,
    retry: 1,
  });

  const updateMutation = useMutation({
    mutationFn: (input: ProfileInput) => saveProfile(input, activeId),
    onSuccess: (response) => {
      queryClient.setQueryData(profileQueryKey, response);
      setSaveErrorMessage(null);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully.');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    },
    onError: () => {
      setSaveErrorMessage("We couldn't save your changes. Your edits have been kept.");
    },
  });

  const handleSave = async (data: ProfileInput) => {
    setSaveErrorMessage(null);
    try {
      await updateMutation.mutateAsync(data);
    } catch {
      // Handled in onError callback and UI state
    }
  };

  const handleCancelEdit = () => {
    setSaveErrorMessage(null);
    setIsEditing(false);
  };

  if (!activeId) {
    return (
      <section className="py-2">
        <title>Profile | WASL</title>
        <ProfileErrorState
          error={new Error('No active profile ID')}
          onRetry={() => {}}
          isNotFound={true}
        />
      </section>
    );
  }

  if (profileQuery.isPending) {
    return (
      <section className="py-2">
        <title>Profile | WASL</title>
        <ProfileLoadingState />
      </section>
    );
  }

  if (profileQuery.isError) {
    const isNotFound =
      (profileQuery.error instanceof ApiError && profileQuery.error.status === 404) ||
      (profileQuery.error instanceof ApiError && profileQuery.error.code === 'NOT_FOUND');

    return (
      <section className="py-2">
        <title>Profile | WASL</title>
        <ProfileErrorState
          error={profileQuery.error}
          onRetry={() => profileQuery.refetch()}
          isNotFound={isNotFound}
        />
      </section>
    );
  }

  const profileData = profileQuery.data.data;

  return (
    <section className="py-2">
      <title>Profile | WASL</title>

      {successMessage ? (
        <div
          role="status"
          className="mb-6 p-4 rounded-xl border border-success/30 bg-success-muted text-success text-sm font-medium flex items-center justify-between"
        >
          <span>{successMessage}</span>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-xs hover:underline focus:outline-none"
          >
            Dismiss
          </button>
        </div>
      ) : null}

      {isEditing ? (
        <ProfileForm
          initialProfile={profileData}
          isSaving={updateMutation.isPending}
          saveError={saveErrorMessage}
          onSave={handleSave}
          onCancel={handleCancelEdit}
        />
      ) : (
        <ProfileView
          profile={profileData}
          onEdit={() => {
            setSuccessMessage(null);
            setIsEditing(true);
          }}
        />
      )}
    </section>
  );
}
