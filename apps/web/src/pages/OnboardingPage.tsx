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
import { arrivalStages, turkishLevels, commonInterests, commonGoals } from '../features/profiles/profileConstants';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

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
    mutationFn: (profileInput: ProfileInput) => saveProfile(profileInput),
    onSuccess: (profileResponse) => {
      queryClient.setQueryData(profileQueryKey, profileResponse);
    },
  });

  const currentInterests = form.watch('interests') || [];
  const currentGoals = form.watch('goals') || [];

  const toggleInterest = (interest: string) => {
    if (currentInterests.includes(interest)) {
      form.setValue(
        'interests',
        currentInterests.filter((i) => i !== interest),
        { shouldValidate: true },
      );
    } else {
      if (currentInterests.length < 20) {
        form.setValue('interests', [...currentInterests, interest], { shouldValidate: true });
      }
    }
  };

  const toggleGoal = (goal: string) => {
    if (currentGoals.includes(goal)) {
      form.setValue(
        'goals',
        currentGoals.filter((g) => g !== goal),
        { shouldValidate: true },
      );
    } else {
      if (currentGoals.length < 20) {
        form.setValue('goals', [...currentGoals, goal], { shouldValidate: true });
      }
    }
  };

  return (
    <section className="max-w-2xl">
      <title>Onboarding | WASL</title>
      <h1 className="text-3xl font-bold">Tell us where you are starting</h1>
      <p className="mt-2 text-muted-foreground">This profile is used to rank real, verified options.</p>
      <form
        className="mt-8 grid gap-5"
        onSubmit={form.handleSubmit((profileInput) => profileMutation.mutate(profileInput))}
      >
        <TextField label="City" error={form.formState.errors.city?.message} {...form.register('city')} />
        <TextField label="University" error={form.formState.errors.university?.message} {...form.register('university')} />
        <TextField label="Specialization" error={form.formState.errors.specialization?.message} {...form.register('specialization')} />
        <label className="grid gap-1 font-medium">
          Arrival stage
          <select className="rounded-md border bg-background px-3 py-2" {...form.register('arrivalStage')}>
            {arrivalStages.map((stage) => <option key={stage}>{stage}</option>)}
          </select>
        </label>
        <label className="grid gap-1 font-medium">
          Turkish level
          <select className="rounded-md border bg-background px-3 py-2" {...form.register('turkishLevel')}>
            {turkishLevels.map((level) => <option key={level}>{level}</option>)}
          </select>
        </label>
        <div className="grid gap-2">
          <span className="font-medium">Interests</span>
          <div className="flex flex-wrap gap-2">
            {commonInterests.map((interest) => {
              const isSelected = currentInterests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  aria-pressed={isSelected}
                  className="focus:outline-none"
                >
                  <Badge variant={isSelected ? 'pillActive' : 'pill'} className="cursor-pointer text-sm">
                    {interest} {isSelected ? '✓' : '+'}
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>
        <div className="grid gap-2">
          <span className="font-medium">Goals</span>
          <div className="flex flex-wrap gap-2">
            {commonGoals.map((goal) => {
              const isSelected = currentGoals.includes(goal);
              return (
                <button
                  key={goal}
                  type="button"
                  onClick={() => toggleGoal(goal)}
                  aria-pressed={isSelected}
                  className="focus:outline-none"
                >
                  <Badge variant={isSelected ? 'pillActive' : 'pill'} className="cursor-pointer text-sm">
                    {goal} {isSelected ? '✓' : '+'}
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>
        {profileMutation.isError ? <p role="alert" className="text-red-700">{profileMutation.error.message}</p> : null}
        {profileMutation.isSuccess ? <p role="status" className="text-green-700">Your profile is ready.</p> : null}
        <Button
          type="submit"
          disabled={profileMutation.isPending}
          size="lg"
        >
          {profileMutation.isPending ? 'Saving…' : 'Save profile'}
        </Button>
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
      <input id={inputId} className="rounded-md border bg-background px-3 py-2" {...inputProps} />
      {error ? <span className="text-sm text-red-700">{error}</span> : null}
    </label>
  );
}
