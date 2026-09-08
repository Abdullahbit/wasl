import type { ScorableInterest, ScoringProfile } from './types.js'

export interface ScorableOpportunity {
  interests: ScorableInterest[]
  isVerified: boolean
  targetCountry: string | null
}

const MAX_INTEREST_BONUS = 6
const INTEREST_POINTS = 2
const COUNTRY_MATCH_BONUS = 1
const VERIFIED_BONUS = 1

/**
 * Pure scoring function — no DB access.
 * +2 per overlapping interest (up to +6)
 * +1 if targetCountry matches profile.targetCountry
 * +1 if isVerified
 */
export function scoreOpportunity(opportunity: ScorableOpportunity, profile: ScoringProfile): number {
  let score = 0

  const overlappingInterests = opportunity.interests.filter((interest) =>
    profile.interests.includes(interest.name),
  ).length
  score += Math.min(overlappingInterests * INTEREST_POINTS, MAX_INTEREST_BONUS)

  if (
    opportunity.targetCountry != null &&
    profile.targetCountry != null &&
    opportunity.targetCountry === profile.targetCountry
  ) {
    score += COUNTRY_MATCH_BONUS
  }

  if (opportunity.isVerified) {
    score += VERIFIED_BONUS
  }

  return score
}
