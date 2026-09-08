import * as profileRepo from './profile.repository.js'
import { NotFoundError } from '../../shared/errors/AppError.js'
import type { ProfileUpdate } from '@platform/contracts'
import type { Prisma } from '@prisma/client'

function isProfileComplete(data: {
  originCountry?: string | null | undefined
  targetCountry?: string | null | undefined
  languages?: string[] | undefined
  interests?: string[] | undefined
}): boolean {
  return !!(
    data.originCountry &&
    data.targetCountry &&
    data.languages && data.languages.length > 0 &&
    data.interests && data.interests.length > 0
  )
}

export async function getProfile(userId: string) {
  const profile = await profileRepo.findProfileByUserId(userId)
  if (!profile) {
    // Return null instead of 404 — user may not have completed onboarding yet
    return null
  }
  return profile
}

export async function upsertProfile(userId: string, data: ProfileUpdate) {
  const existing = await profileRepo.findProfileByUserId(userId)
  const merged = {
    originCountry: data.originCountry ?? existing?.originCountry,
    targetCountry: data.targetCountry ?? existing?.targetCountry,
    languages: data.languages ?? existing?.languages,
    interests: data.interests ?? existing?.interests,
  }
  const profileComplete = isProfileComplete(merged)

  // Build update input, only setting defined fields to avoid exactOptionalPropertyTypes issues
  const updateData: Prisma.ProfileUpdateInput = { profileComplete }
  if (data.bio !== undefined) updateData.bio = data.bio
  if (data.originCountry !== undefined) updateData.originCountry = data.originCountry
  if (data.targetCountry !== undefined) updateData.targetCountry = data.targetCountry
  if (data.currentCity !== undefined) updateData.currentCity = data.currentCity
  if (data.languages !== undefined) updateData.languages = { set: data.languages }
  if (data.interests !== undefined) updateData.interests = { set: data.interests }
  if (data.goals !== undefined) updateData.goals = data.goals
  if (data.immigrationStatus !== undefined) updateData.immigrationStatus = data.immigrationStatus
  if (data.visaType !== undefined) updateData.visaType = data.visaType
  if (data.arrivalDate !== undefined) updateData.arrivalDate = new Date(data.arrivalDate)

  return profileRepo.upsertProfile(userId, updateData)
}

export async function markOnboardingComplete(userId: string) {
  const profile = await profileRepo.findProfileByUserId(userId)
  if (!profile) throw new NotFoundError('Profile')
  if (!isProfileComplete(profile)) {
    throw new Error('Profile is not complete enough to mark as complete')
  }
  return profileRepo.markProfileComplete(userId)
  // Analytics event will be wired in Task 10
}
