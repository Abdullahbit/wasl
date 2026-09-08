/**
 * Collects a validated newcomer profile and persists it through the authenticated API.
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileInputSchema, type ProfileInput } from '@wasl/contracts';
import { useForm } from 'react-hook-form';
import type { InputHTMLAttributes } from 'react';
import type { z } from 'zod';
import { profileQueryKey, saveProfile } from '../features/profiles/profileApi';

const arrivalStages = ProfileInputSchema.shape.arrivalStage.options;
const turkishLevels = ProfileInputSchema.shape.turkishLevel.options;
type ProfileFormInput = z.input<typeof ProfileInputSchema>;

export function OnboardingPage() {
  const queryClient = useQueryClient();
  const form = useForm<ProfileFormInput, unknown, ProfileInput>({
    resolver: zodResolver(ProfileInputSchema),
    defaultValues: {
      city: '',
      university: '',
      arrivalStage: 'Preparing',
      turkishLevel: 'None',
      specialization: '',
      interests: [],
      goals: [],
    },
  });
  const profileMutation = useMutation({
    mutationFn: saveProfile,
    onSuccess: (profileResponse) => {
      queryClient.setQueryData(profileQueryKey, profileResponse);
    },
  });

  return (
    <section className="max-w-2xl">
      <title>Onboarding | WASL</title>
      <h1 className="text-3xl font-bold">Tell us where you are starting</h1>
      <p className="mt-2 text-gray-600">This profile is used to rank real, verified options.</p>
      <form
        className="mt-8 grid gap-5"
        onSubmit={form.handleSubmit((profileInput) => profileMutation.mutate(profileInput))}
      >
        <TextField label="City" error={form.formState.errors.city?.message} {...form.register('city')} />
        <TextField label="University" error={form.formState.errors.university?.message} {...form.register('university')} />
        <TextField label="Specialization" error={form.formState.errors.specialization?.message} {...form.register('specialization')} />
        <label className="grid gap-1 font-medium">
          Arrival stage
          <select className="rounded-md border px-3 py-2" {...form.register('arrivalStage')}>
            {arrivalStages.map((stage) => <option key={stage}>{stage}</option>)}
          </select>
        </label>
        <label className="grid gap-1 font-medium">
          Turkish level
          <select className="rounded-md border px-3 py-2" {...form.register('turkishLevel')}>
            {turkishLevels.map((level) => <option key={level}>{level}</option>)}
          </select>
        </label>
        {profileMutation.isError ? <p role="alert" className="text-red-700">{profileMutation.error.message}</p> : null}
        {profileMutation.isSuccess ? <p role="status" className="text-green-700">Your profile is ready.</p> : null}
        <button
          type="submit"
          disabled={profileMutation.isPending}
          className="rounded-md bg-blue-700 px-4 py-3 font-semibold text-white disabled:opacity-60"
        >
          {profileMutation.isPending ? 'Saving…' : 'Save profile'}
        </button>
      </form>
    </section>
  );
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | undefined;
}

function TextField({ label, error, id, ...inputProps }: TextFieldProps) {
  const inputId = id ?? inputProps.name;

  return (
    <label className="grid gap-1 font-medium" htmlFor={inputId}>
      {label}
      <input id={inputId} className="rounded-md border px-3 py-2" {...inputProps} />
      {error ? <span className="text-sm text-red-700">{error}</span> : null}
    </label>
  );
}
