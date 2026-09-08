import { describe, it, expect } from 'vitest';
import { scoreCommunity } from '../recommendation.service';
import { Profile, Community } from '@prisma/client';

describe('Recommendation Service', () => {
  const mockProfile: Pick<Profile, 'university' | 'interests' | 'goals' | 'turkishLevel' | 'arrivalStage'> = {
    university: 'Beykoz University',
    interests: ['Software', 'AI'],
    goals: ['Networking', 'Career'],
    turkishLevel: 'Beginner',
    arrivalStage: 'First Week',
  };

  it('should score a perfect match community correctly', () => {
    const perfectCommunity: Pick<Community, 'universities' | 'interests' | 'languages' | 'targetAudience' | 'newcomerFriendly'> = {
      universities: ['Beykoz University'],
      interests: ['Software'],
      languages: ['English', 'Turkish'],
      targetAudience: 'Networking',
      newcomerFriendly: true,
    };

    const { score, breakdown } = scoreCommunity(mockProfile, perfectCommunity);

    // Expected score:
    // University (+30)
    // Interest match (+25)
    // Goal match (+20)
    // Language match (+10)
    // Newcomer friendly (+5)
    // Arrival stage doesn't match targetAudience here (no 'Newcomers' or 'First Week'), so no +10
    expect(score).toBe(90);
    expect(breakdown['University match']).toBe(30);
    expect(breakdown['Interest match']).toBe(25);
    expect(breakdown['Goal match']).toBe(20);
    expect(breakdown['Language match']).toBe(10);
    expect(breakdown['Newcomer-friendly']).toBe(5);
  });

  it('should add arrival stage score if target audience matches', () => {
    const friendlyCommunity: Pick<Community, 'universities' | 'interests' | 'languages' | 'targetAudience' | 'newcomerFriendly'> = {
      universities: ['Any'],
      interests: [],
      languages: ['Arabic'],
      targetAudience: 'Newcomers',
      newcomerFriendly: true,
    };

    const { score, breakdown } = scoreCommunity(mockProfile, friendlyCommunity);

    // Score: University (+30) [matches 'Any'], Arrival Stage (+10), Newcomer friendly (+5)
    expect(score).toBe(45);
    expect(breakdown['Arrival-stage match']).toBe(10);
  });
});
