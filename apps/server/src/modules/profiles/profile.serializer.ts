/**
 * Converts database profile records into transport-safe contract values.
 */

import type { Profile } from '@prisma/client';
import type { ProfileResponse } from '@wasl/contracts';

export function serializeProfile(profile: Profile): ProfileResponse {
  return {
    city: profile.city,
    university: profile.university,
    arrivalStage: profile.arrivalStage as ProfileResponse['arrivalStage'],
    turkishLevel: profile.turkishLevel as ProfileResponse['turkishLevel'],
    specialization: profile.specialization,
    interests: profile.interests,
    goals: profile.goals,
    id: profile.id,
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
  };
}
