/**
 * Interactive Profile editing form supporting all shared ProfileInput fields.
 * Reuses canonical domain constants and validates strictly against ProfileInputSchema.
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProfileInputSchema, type ProfileInput, type ProfileResponse } from '@wasl/contracts';
import type { z } from 'zod';
import { arrivalStages, turkishLevels, commonInterests, commonGoals } from './profileConstants';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { X, Plus } from 'lucide-react';

type ProfileFormInput = z.input<typeof ProfileInputSchema>;

interface ProfileFormProps {
  initialProfile: ProfileResponse;
  isSaving: boolean;
  saveError: string | null;
  onSave: (data: ProfileInput) => Promise<void>;
  onCancel: () => void;
}

export function ProfileForm({
  initialProfile,
  isSaving,
  saveError,
  onSave,
  onCancel,
}: ProfileFormProps) {
  const form = useForm<ProfileFormInput, unknown, ProfileInput>({
    resolver: zodResolver(ProfileInputSchema),
    defaultValues: {
      city: initialProfile.city,
      university: initialProfile.university,
      specialization: initialProfile.specialization,
      arrivalStage: initialProfile.arrivalStage,
      turkishLevel: initialProfile.turkishLevel,
      interests: initialProfile.interests || [],
      goals: initialProfile.goals || [],
    },
  });

  const [customInterest, setCustomInterest] = useState('');
  const [customGoal, setCustomGoal] = useState('');

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

  const addCustomInterest = () => {
    const trimmed = customInterest.trim();
    if (trimmed && !currentInterests.includes(trimmed) && currentInterests.length < 20) {
      form.setValue('interests', [...currentInterests, trimmed], { shouldValidate: true });
      setCustomInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    form.setValue(
      'interests',
      currentInterests.filter((i) => i !== interest),
      { shouldValidate: true },
    );
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

  const addCustomGoal = () => {
    const trimmed = customGoal.trim();
    if (trimmed && !currentGoals.includes(trimmed) && currentGoals.length < 20) {
      form.setValue('goals', [...currentGoals, trimmed], { shouldValidate: true });
      setCustomGoal('');
    }
  };

  const removeGoal = (goal: string) => {
    form.setValue(
      'goals',
      currentGoals.filter((g) => g !== goal),
      { shouldValidate: true },
    );
  };

  const onSubmit = async (data: ProfileInput) => {
    await onSave(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground">Edit Profile</h2>
          <p className="text-sm text-muted-foreground">
            Update your profile details to keep your personalized recommendations accurate.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
          >
            {isSaving ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </div>

      {saveError ? (
        <div
          role="alert"
          className="p-4 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-sm font-medium"
        >
          {saveError}
        </div>
      ) : null}

      {/* Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Personal & Academic Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          {/* City */}
          <div className="space-y-1.5">
            <label htmlFor="profile-city" className="text-sm font-medium text-foreground">
              City <span className="text-destructive">*</span>
            </label>
            <input
              id="profile-city"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              aria-invalid={!!form.formState.errors.city}
              aria-describedby={form.formState.errors.city ? 'city-error' : undefined}
              {...form.register('city')}
            />
            {form.formState.errors.city?.message ? (
              <p id="city-error" className="text-xs text-destructive font-medium">
                {form.formState.errors.city.message}
              </p>
            ) : null}
          </div>

          {/* University */}
          <div className="space-y-1.5">
            <label htmlFor="profile-university" className="text-sm font-medium text-foreground">
              University <span className="text-destructive">*</span>
            </label>
            <input
              id="profile-university"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              aria-invalid={!!form.formState.errors.university}
              aria-describedby={form.formState.errors.university ? 'university-error' : undefined}
              {...form.register('university')}
            />
            {form.formState.errors.university?.message ? (
              <p id="university-error" className="text-xs text-destructive font-medium">
                {form.formState.errors.university.message}
              </p>
            ) : null}
          </div>

          {/* Specialization */}
          <div className="space-y-1.5">
            <label htmlFor="profile-specialization" className="text-sm font-medium text-foreground">
              Specialization <span className="text-destructive">*</span>
            </label>
            <input
              id="profile-specialization"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              aria-invalid={!!form.formState.errors.specialization}
              aria-describedby={form.formState.errors.specialization ? 'specialization-error' : undefined}
              {...form.register('specialization')}
            />
            {form.formState.errors.specialization?.message ? (
              <p id="specialization-error" className="text-xs text-destructive font-medium">
                {form.formState.errors.specialization.message}
              </p>
            ) : null}
          </div>

          {/* Arrival Stage */}
          <div className="space-y-1.5">
            <label htmlFor="profile-arrivalStage" className="text-sm font-medium text-foreground">
              Arrival stage <span className="text-destructive">*</span>
            </label>
            <select
              id="profile-arrivalStage"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              aria-invalid={!!form.formState.errors.arrivalStage}
              aria-describedby={form.formState.errors.arrivalStage ? 'arrivalStage-error' : undefined}
              {...form.register('arrivalStage')}
            >
              {arrivalStages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
            {form.formState.errors.arrivalStage?.message ? (
              <p id="arrivalStage-error" className="text-xs text-destructive font-medium">
                {form.formState.errors.arrivalStage.message}
              </p>
            ) : null}
          </div>

          {/* Turkish Level */}
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="profile-turkishLevel" className="text-sm font-medium text-foreground">
              Turkish level <span className="text-destructive">*</span>
            </label>
            <select
              id="profile-turkishLevel"
              className="w-full sm:max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              aria-invalid={!!form.formState.errors.turkishLevel}
              aria-describedby={form.formState.errors.turkishLevel ? 'turkishLevel-error' : undefined}
              {...form.register('turkishLevel')}
            >
              {turkishLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            {form.formState.errors.turkishLevel?.message ? (
              <p id="turkishLevel-error" className="text-xs text-destructive font-medium">
                {form.formState.errors.turkishLevel.message}
              </p>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {/* Interests Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Interests</CardTitle>
          <p className="text-xs text-muted-foreground">Select popular interests or add your own.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {commonInterests.map((interest) => {
              const isSelected = currentInterests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  aria-pressed={isSelected}
                  className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
                >
                  <Badge variant={isSelected ? 'pillActive' : 'pill'} className="cursor-pointer text-sm">
                    {interest} {isSelected ? '✓' : '+'}
                  </Badge>
                </button>
              );
            })}
          </div>

          {/* Custom interest addition */}
          <div className="flex gap-2 max-w-sm">
            <input
              type="text"
              placeholder="Add other interest..."
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomInterest();
                }
              }}
              className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addCustomInterest}
              disabled={!customInterest.trim()}
            >
              <Plus className="h-4 w-4 me-1" /> Add
            </Button>
          </div>

          {/* Selected interests tags */}
          {currentInterests.length > 0 ? (
            <div className="pt-2 border-t border-border">
              <span className="text-xs font-semibold text-muted-foreground block mb-2">
                Selected ({currentInterests.length}):
              </span>
              <div className="flex flex-wrap gap-2">
                {currentInterests.map((interest) => (
                  <span
                    key={interest}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-muted text-primary text-xs font-semibold"
                  >
                    <bdi dir="auto">{interest}</bdi>
                    <button
                      type="button"
                      onClick={() => removeInterest(interest)}
                      className="hover:opacity-75 focus:outline-none"
                      aria-label={`Remove ${interest}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {form.formState.errors.interests?.message ? (
            <p className="text-xs text-destructive font-medium">
              {form.formState.errors.interests.message}
            </p>
          ) : null}
        </CardContent>
      </Card>

      {/* Goals Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Goals</CardTitle>
          <p className="text-xs text-muted-foreground">Select goals to help WASL prioritize opportunities.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {commonGoals.map((goal) => {
              const isSelected = currentGoals.includes(goal);
              return (
                <button
                  key={goal}
                  type="button"
                  onClick={() => toggleGoal(goal)}
                  aria-pressed={isSelected}
                  className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
                >
                  <Badge variant={isSelected ? 'pillActive' : 'pill'} className="cursor-pointer text-sm">
                    {goal} {isSelected ? '✓' : '+'}
                  </Badge>
                </button>
              );
            })}
          </div>

          {/* Custom goal addition */}
          <div className="flex gap-2 max-w-sm">
            <input
              type="text"
              placeholder="Add other goal..."
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomGoal();
                }
              }}
              className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addCustomGoal}
              disabled={!customGoal.trim()}
            >
              <Plus className="h-4 w-4 me-1" /> Add
            </Button>
          </div>

          {/* Selected goals tags */}
          {currentGoals.length > 0 ? (
            <div className="pt-2 border-t border-border">
              <span className="text-xs font-semibold text-muted-foreground block mb-2">
                Selected ({currentGoals.length}):
              </span>
              <div className="flex flex-wrap gap-2">
                {currentGoals.map((goal) => (
                  <span
                    key={goal}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-muted text-primary text-xs font-semibold"
                  >
                    <bdi dir="auto">{goal}</bdi>
                    <button
                      type="button"
                      onClick={() => removeGoal(goal)}
                      className="hover:opacity-75 focus:outline-none"
                      aria-label={`Remove ${goal}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {form.formState.errors.goals?.message ? (
            <p className="text-xs text-destructive font-medium">
              {form.formState.errors.goals.message}
            </p>
          ) : null}
        </CardContent>
      </Card>

      {/* Bottom Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSaving}
        >
          {isSaving ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
}
