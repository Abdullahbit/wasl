import type { ScorableInterest, ScoringProfile } from './types.js'

export interface ScorableResource {
  interests: ScorableInterest[]
  isVerified: boolean
}

const MAX_INTEREST_BONUS = 6
const INTEREST_POINTS = 2
const VERIFIED_BONUS = 1

/**
 * Pure scoring function — no DB access.
 * +2 per overlapping interest (up to +6)
 * +1 if isVerified
 */
export function scoreResource(resource: ScorableResource, profile: ScoringProfile): number {
  let score = 0

  const overlappingInterests = resource.interests.filter((interest) =>
    profile.interests.includes(interest.name),
  ).length
  score += Math.min(overlappingInterests * INTEREST_POINTS, MAX_INTEREST_BONUS)

  if (resource.isVerified) {
    score += VERIFIED_BONUS
  }

  return score
}
