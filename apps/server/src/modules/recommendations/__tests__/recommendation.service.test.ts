/**
 * Verifies the deterministic scoring rules that ground all AI recommendations.
 */

import { describe, it, expect } from 'vitest';
import { scoreCommunity } from '../recommendation.service.js';
import type { Profile, Community } from '@prisma/client';

describe('scoreCommunity', () => {
  const mockProfile: Pick<Profile, 'university' | 'interests' | 'goals' | 'turkishLevel' | 'arrivalStage'> = {
    university: 'Beykoz University',
    interests: ['Software', 'AI'],
    goals: ['Networking', 'Career'],
    turkishLevel: 'Beginner',
    arrivalStage: 'First Week',
  };

  it('scores each matching profile signal', () => {
    const perfectCommunity: Pick<Community, 'universities' | 'interests' | 'languages' | 'targetAudience' | 'newcomerFriendly'> = {
      universities: ['Beykoz University'],
      interests: ['Software'],
      languages: ['English', 'Turkish'],
      targetAudience: 'Networking',
      newcomerFriendly: true,
    };

    const { score, breakdown } = scoreCommunity(mockProfile, perfectCommunity);

    expect(score).toBe(90);
    expect(breakdown['University match']).toBe(30);
    expect(breakdown['Interest match']).toBe(25);
    expect(breakdown['Goal match']).toBe(20);
    expect(breakdown['Language match']).toBe(10);
    expect(breakdown['Newcomer-friendly']).toBe(5);
  });

  it('adds an arrival-stage score for newcomer communities', () => {
    const friendlyCommunity: Pick<Community, 'universities' | 'interests' | 'languages' | 'targetAudience' | 'newcomerFriendly'> = {
      universities: ['Any'],
      interests: [],
      languages: ['Arabic'],
      targetAudience: 'Newcomers',
      newcomerFriendly: true,
    };

    const { score, breakdown } = scoreCommunity(mockProfile, friendlyCommunity);

    expect(score).toBe(45);
    expect(breakdown['Arrival-stage match']).toBe(10);
  });
});
