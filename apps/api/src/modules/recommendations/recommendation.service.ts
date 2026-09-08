import { Profile, Community } from '@prisma/client';
import { RecommendationScore } from '@wasl/contracts';

const WEIGHTS = {
  UNIVERSITY: 30,
  INTEREST: 25,
  GOAL: 20,
  LANGUAGE: 10,
  ARRIVAL_STAGE: 10,
  NEWCOMER_FRIENDLY: 5,
};

export const scoreCommunity = (
  profile: Pick<Profile, 'university' | 'interests' | 'goals' | 'turkishLevel' | 'arrivalStage'>,
  community: Pick<Community, 'universities' | 'interests' | 'languages' | 'targetAudience' | 'newcomerFriendly'>
): RecommendationScore => {
  let score = 0;
  const breakdown: Record<string, number> = {};

  // 1. University match +30
  if (community.universities.includes(profile.university) || community.universities.includes('Any')) {
    score += WEIGHTS.UNIVERSITY;
    breakdown['University match'] = WEIGHTS.UNIVERSITY;
  }

  // 2. Interest match +25
  const commonInterests = profile.interests.filter(i => community.interests.includes(i));
  if (commonInterests.length > 0) {
    score += WEIGHTS.INTEREST;
    breakdown['Interest match'] = WEIGHTS.INTEREST;
  }

  // 3. Goal match +20
  const goalMatch = profile.goals.some(g => community.targetAudience?.includes(g));
  if (goalMatch) {
    score += WEIGHTS.GOAL;
    breakdown['Goal match'] = WEIGHTS.GOAL;
  }

  // 4. Language match +10
  // Simplify: assume English is a fallback or Turkish level is enough.
  const speaksCommunityLanguage = community.languages.includes('English') || 
                                  (profile.turkishLevel !== 'None' && community.languages.includes('Turkish'));
  if (speaksCommunityLanguage) {
    score += WEIGHTS.LANGUAGE;
    breakdown['Language match'] = WEIGHTS.LANGUAGE;
  }

  // 5. Arrival-stage match +10
  if (community.targetAudience?.includes('Newcomers') || community.targetAudience?.includes(profile.arrivalStage)) {
    score += WEIGHTS.ARRIVAL_STAGE;
    breakdown['Arrival-stage match'] = WEIGHTS.ARRIVAL_STAGE;
  }

  // 6. Newcomer-friendly +5
  if (community.newcomerFriendly) {
    score += WEIGHTS.NEWCOMER_FRIENDLY;
    breakdown['Newcomer-friendly'] = WEIGHTS.NEWCOMER_FRIENDLY;
  }

  return {
    score,
    breakdown
  };
};
