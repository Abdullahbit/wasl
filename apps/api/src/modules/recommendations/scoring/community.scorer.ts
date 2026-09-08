import type { ScorableInterest, ScorableLanguage, ScoringProfile } from './types.js'

export interface ScorableCommunity {
  languages: ScorableLanguage[]
  interests: ScorableInterest[]
  isVerified: boolean
  memberCount: number | null
}

const MAX_INTEREST_BONUS = 6
const INTEREST_POINTS = 2
const LANGUAGE_MATCH_BONUS = 3
const VERIFIED_BONUS = 1
const POPULAR_BONUS = 1
const POPULAR_THRESHOLD = 100

/**
 * Pure scoring function — no DB access.
 * +3 if any language matches profile.languages
 * +2 per overlapping interest (up to +6)
 * +1 if community.isVerified
 * +1 if community.memberCount > 100
 */
export function scoreCommunity(community: ScorableCommunity, profile: ScoringProfile): number {
  let score = 0

  const hasLanguageMatch = community.languages.some(
    (lang) => profile.languages.includes(lang.name) || profile.languages.includes(lang.code),
  )
  if (hasLanguageMatch) {
    score += LANGUAGE_MATCH_BONUS
  }

  const overlappingInterests = community.interests.filter((interest) =>
    profile.interests.includes(interest.name),
  ).length
  score += Math.min(overlappingInterests * INTEREST_POINTS, MAX_INTEREST_BONUS)

  if (community.isVerified) {
    score += VERIFIED_BONUS
  }

  if (community.memberCount != null && community.memberCount > POPULAR_THRESHOLD) {
    score += POPULAR_BONUS
  }

  return score
}
