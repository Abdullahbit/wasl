/**
 * Scores approved communities deterministically so recommendations remain testable.
 *
 * Weights are centralized and bounded to 100. AI never influences scoring.
 */

import { Profile, Community } from '@prisma/client';
import { RecommendationScore } from '@wasl/contracts';

export const RECOMMENDATION_WEIGHTS = {
  UNIVERSITY_MATCH: 30,
  INTEREST_MATCH: 25,
  GOAL_MATCH: 20,
  LANGUAGE_MATCH: 10,
  ARRIVAL_MATCH: 10,
  NEWCOMER_FRIENDLY: 5,
} as const;

export const MAXIMUM_RECOMMENDATION_SCORE = 100;

export const REASON_CODES = {
  UNIVERSITY_MATCH: 'UNIVERSITY_MATCH',
  INTEREST_MATCH: 'INTEREST_MATCH',
  GOAL_MATCH: 'GOAL_MATCH',
  LANGUAGE_MATCH: 'LANGUAGE_MATCH',
  ARRIVAL_MATCH: 'ARRIVAL_MATCH',
  NEWCOMER_FRIENDLY: 'NEWCOMER_FRIENDLY',
} as const;

export type ReasonCode = (typeof REASON_CODES)[keyof typeof REASON_CODES];

export function scoreCommunity(
  profile: Pick<Profile, 'university' | 'interests' | 'goals' | 'turkishLevel' | 'arrivalStage'>,
  community: Pick<Community, 'universities' | 'interests' | 'languages' | 'targetAudience' | 'newcomerFriendly'>,
): RecommendationScore & { reasonCodes: ReasonCode[] } {
  let score = 0;
  const breakdown: Record<string, number> = {};
  const reasonCodes: ReasonCode[] = [];

  if (community.universities.includes(profile.university) || community.universities.includes('Any')) {
    score += RECOMMENDATION_WEIGHTS.UNIVERSITY_MATCH;
    breakdown['University match'] = RECOMMENDATION_WEIGHTS.UNIVERSITY_MATCH;
    reasonCodes.push(REASON_CODES.UNIVERSITY_MATCH);
  }

  const commonInterests = profile.interests.filter((interest: string) => community.interests.includes(interest));
  if (commonInterests.length > 0) {
    score += RECOMMENDATION_WEIGHTS.INTEREST_MATCH;
    breakdown['Interest match'] = RECOMMENDATION_WEIGHTS.INTEREST_MATCH;
    reasonCodes.push(REASON_CODES.INTEREST_MATCH);
  }

  const goalMatch = profile.goals.some((goal: string) => community.targetAudience?.includes(goal));
  if (goalMatch) {
    score += RECOMMENDATION_WEIGHTS.GOAL_MATCH;
    breakdown['Goal match'] = RECOMMENDATION_WEIGHTS.GOAL_MATCH;
    reasonCodes.push(REASON_CODES.GOAL_MATCH);
  }

  const speaksLanguage =
    community.languages.includes('English') ||
    (profile.turkishLevel !== 'None' && community.languages.includes('Turkish'));
  if (speaksLanguage) {
    score += RECOMMENDATION_WEIGHTS.LANGUAGE_MATCH;
    breakdown['Language match'] = RECOMMENDATION_WEIGHTS.LANGUAGE_MATCH;
    reasonCodes.push(REASON_CODES.LANGUAGE_MATCH);
  }

  if (community.targetAudience?.includes('Newcomers') || community.targetAudience?.includes(profile.arrivalStage)) {
    score += RECOMMENDATION_WEIGHTS.ARRIVAL_MATCH;
    breakdown['Arrival-stage match'] = RECOMMENDATION_WEIGHTS.ARRIVAL_MATCH;
    reasonCodes.push(REASON_CODES.ARRIVAL_MATCH);
  }

  if (community.newcomerFriendly) {
    score += RECOMMENDATION_WEIGHTS.NEWCOMER_FRIENDLY;
    breakdown['Newcomer-friendly'] = RECOMMENDATION_WEIGHTS.NEWCOMER_FRIENDLY;
    reasonCodes.push(REASON_CODES.NEWCOMER_FRIENDLY);
  }

  score = Math.min(score, MAXIMUM_RECOMMENDATION_SCORE);

  return {
    score,
    breakdown,
    reasonCodes,
  };
}

/**
 * Selects top N communities deterministically.
 * Sorting: score descending, then id ascending for tie-break.
 */
export function selectTopCommunities<T extends { id: string; score: number }>(scored: T[], topN = 5): T[] {
  return [...scored]
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.id.localeCompare(b.id);
    })
    .slice(0, topN);
}
