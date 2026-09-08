/**
 * Shared canonical profile options, values, and definitions used across Onboarding and Profile views.
 * The shared Zod contract (@wasl/contracts) remains the domain authority.
 */

import { ProfileInputSchema } from '@wasl/contracts';

export const arrivalStages = ProfileInputSchema.shape.arrivalStage.options;
export const turkishLevels = ProfileInputSchema.shape.turkishLevel.options;

export const commonInterests: readonly string[] = [
  'Software',
  'AI',
  'Design',
  'Startups',
  'Culture',
  'Language Exchange',
  'Volunteering',
  'Sports',
  'Music',
  'Photography',
] as const;

export const commonGoals: readonly string[] = [
  'Career',
  'Networking',
  'Learn Turkish',
  'Make Friends',
  'Find Housing',
  'Academic Success',
  'Explore Istanbul',
] as const;
