/**
 * Verifies the deterministic scoring rules that ground all AI recommendations.
 */

import { describe, it, expect } from 'vitest';
import { scoreCommunity, selectTopCommunities, RECOMMENDATION_WEIGHTS, MAXIMUM_RECOMMENDATION_SCORE } from '../recommendation.service.js';
import type { Profile, Community } from '@prisma/client';

function makeProfile(overrides: Partial<Pick<Profile, 'university' | 'interests' | 'goals' | 'turkishLevel' | 'arrivalStage'>> = {}): Pick<Profile, 'university' | 'interests' | 'goals' | 'turkishLevel' | 'arrivalStage'> {
  return {
    university: 'Beykoz University',
    interests: ['Software', 'AI'],
    goals: ['Networking', 'Career'],
    turkishLevel: 'Beginner',
    arrivalStage: 'First Week',
    ...overrides,
  };
}

function makeCommunity(overrides: Partial<Pick<Community, 'universities' | 'interests' | 'languages' | 'targetAudience' | 'newcomerFriendly'>> = {}): Pick<Community, 'universities' | 'interests' | 'languages' | 'targetAudience' | 'newcomerFriendly'> {
  return {
    universities: ['Beykoz University'],
    interests: ['Software'],
    languages: ['English', 'Turkish'],
    targetAudience: 'Networking',
    newcomerFriendly: true,
    ...overrides,
  };
}

describe('scoreCommunity', () => {
  const baseProfile = makeProfile();

  it('scores each matching profile signal', () => {
    const perfectCommunity = makeCommunity();
    const { score, breakdown } = scoreCommunity(baseProfile, perfectCommunity);
    expect(score).toBe(90);
    expect(breakdown['University match']).toBe(30);
    expect(breakdown['Interest match']).toBe(25);
    expect(breakdown['Goal match']).toBe(20);
    expect(breakdown['Language match']).toBe(10);
    expect(breakdown['Newcomer-friendly']).toBe(5);
  });

  it('adds an arrival-stage score for newcomer communities', () => {
    const friendlyCommunity = makeCommunity({
      universities: ['Any'],
      interests: [],
      languages: ['Arabic'],
      targetAudience: 'Newcomers',
      newcomerFriendly: true,
    });
    const { score, breakdown } = scoreCommunity(baseProfile, friendlyCommunity);
    expect(score).toBe(45);
    expect(breakdown['Arrival-stage match']).toBe(10);
  });

  it('awards +30 for same university', () => {
    const c = makeCommunity({ universities: ['Beykoz University'], interests: [], languages: ['Arabic'], targetAudience: null, newcomerFriendly: false });
    const p = makeProfile({ interests: [], goals: [] });
    const { score, breakdown } = scoreCommunity(p, c);
    expect(breakdown['University match']).toBe(RECOMMENDATION_WEIGHTS.UNIVERSITY_MATCH);
    expect(score).toBe(30);
  });

  it('awards 0 for different university', () => {
    const c = makeCommunity({ universities: ['Istanbul University'], interests: [], languages: ['Arabic'], targetAudience: null, newcomerFriendly: false });
    const p = makeProfile({ university: 'Beykoz University', interests: [], goals: [] });
    const { score } = scoreCommunity(p, c);
    expect(score).toBe(0);
  });

  it('awards university points for city-wide Any', () => {
    const c = makeCommunity({ universities: ['Any'], interests: [], languages: ['Arabic'], targetAudience: null, newcomerFriendly: false });
    const p = makeProfile({ interests: [], goals: [] });
    const { score } = scoreCommunity(p, c);
    expect(score).toBe(30);
  });

  it('awards +25 for interest match and 0 without', () => {
    const withInterest = makeCommunity({ universities: ['Other'], interests: ['Software'], languages: ['Arabic'], targetAudience: null, newcomerFriendly: false });
    const withoutInterest = makeCommunity({ universities: ['Other'], interests: ['Football'], languages: ['Arabic'], targetAudience: null, newcomerFriendly: false });
    const p = makeProfile({ university: 'Other', interests: ['Software'], goals: [] });
    expect(scoreCommunity(p, withInterest).breakdown['Interest match']).toBe(25);
    expect(scoreCommunity(p, withoutInterest).breakdown['Interest match']).toBeUndefined();
  });

  it('awards +20 for goal match and 0 without', () => {
    const withGoal = makeCommunity({ universities: ['Other'], interests: [], languages: ['Arabic'], targetAudience: 'Career', newcomerFriendly: false });
    const withoutGoal = makeCommunity({ universities: ['Other'], interests: [], languages: ['Arabic'], targetAudience: 'Volunteering', newcomerFriendly: false });
    const p = makeProfile({ university: 'Other', interests: [], goals: ['Career'] });
    expect(scoreCommunity(p, withGoal).breakdown['Goal match']).toBe(20);
    expect(scoreCommunity(p, withoutGoal).breakdown['Goal match']).toBeUndefined();
  });

  it('awards +10 for language match via English and via Turkish with Beginner', () => {
    const english = makeCommunity({ universities: ['Other'], interests: [], languages: ['English'], targetAudience: null, newcomerFriendly: false });
    const turkish = makeCommunity({ universities: ['Other'], interests: [], languages: ['Turkish'], targetAudience: null, newcomerFriendly: false });
    const arabic = makeCommunity({ universities: ['Other'], interests: [], languages: ['Arabic'], targetAudience: null, newcomerFriendly: false });
    const pBeginner = makeProfile({ university: 'Other', interests: [], goals: [], turkishLevel: 'Beginner' });
    const pNone = makeProfile({ university: 'Other', interests: [], goals: [], turkishLevel: 'None' });
    expect(scoreCommunity(pBeginner, english).breakdown['Language match']).toBe(10);
    expect(scoreCommunity(pBeginner, turkish).breakdown['Language match']).toBe(10);
    expect(scoreCommunity(pNone, turkish).breakdown['Language match']).toBeUndefined();
    expect(scoreCommunity(pNone, arabic).breakdown['Language match']).toBeUndefined();
  });

  it('awards +10 for arrival relevance', () => {
    const newcomer = makeCommunity({ universities: ['Other'], interests: [], languages: ['Arabic'], targetAudience: 'Newcomers', newcomerFriendly: false });
    const stage = makeCommunity({ universities: ['Other'], interests: [], languages: ['Arabic'], targetAudience: 'First Week', newcomerFriendly: false });
    const none = makeCommunity({ universities: ['Other'], interests: [], languages: ['Arabic'], targetAudience: 'Alumni', newcomerFriendly: false });
    const p = makeProfile({ university: 'Other', interests: [], goals: [] });
    expect(scoreCommunity(p, newcomer).breakdown['Arrival-stage match']).toBe(10);
    expect(scoreCommunity(p, stage).breakdown['Arrival-stage match']).toBe(10);
    expect(scoreCommunity(p, none).breakdown['Arrival-stage match']).toBeUndefined();
  });

  it('awards +5 only when newcomerFriendly true', () => {
    const yes = makeCommunity({ universities: ['Other'], interests: [], languages: ['Arabic'], targetAudience: null, newcomerFriendly: true });
    const no = makeCommunity({ universities: ['Other'], interests: [], languages: ['Arabic'], targetAudience: null, newcomerFriendly: false });
    const nul = makeCommunity({ universities: ['Other'], interests: [], languages: ['Arabic'], targetAudience: null, newcomerFriendly: null as any });
    const p = makeProfile({ university: 'Other', interests: [], goals: [] });
    expect(scoreCommunity(p, yes).breakdown['Newcomer-friendly']).toBe(5);
    expect(scoreCommunity(p, no).breakdown['Newcomer-friendly']).toBeUndefined();
    expect(scoreCommunity(p, nul).breakdown['Newcomer-friendly']).toBeUndefined();
  });

  it('never exceeds 100', () => {
    const maxCommunity = makeCommunity({
      universities: ['Any'],
      interests: ['Software'],
      languages: ['English'],
      targetAudience: 'Networking Newcomers First Week',
      newcomerFriendly: true,
    });
    const p = makeProfile({ interests: ['Software'], goals: ['Networking'] });
    const { score } = scoreCommunity(p, maxCommunity);
    expect(score).toBeLessThanOrEqual(MAXIMUM_RECOMMENDATION_SCORE);
    expect(score).toBe(100);
  });

  it('emits reason codes only when appropriate', () => {
    const c = makeCommunity({ universities: ['Beykoz University'], interests: [], languages: ['Arabic'], targetAudience: null, newcomerFriendly: false });
    const p = makeProfile({ interests: [], goals: [] });
    const { reasonCodes } = scoreCommunity(p, c);
    expect(reasonCodes).toContain('UNIVERSITY_MATCH');
    expect(reasonCodes).not.toContain('INTEREST_MATCH');
    expect(reasonCodes).not.toContain('GOAL_MATCH');
  });

  it('emits all reason codes for perfect match', () => {
    const c = makeCommunity({
      universities: ['Beykoz University'],
      interests: ['Software'],
      languages: ['English'],
      targetAudience: 'Networking Newcomers',
      newcomerFriendly: true,
    });
    const p = makeProfile();
    const { reasonCodes } = scoreCommunity(p, c);
    expect(reasonCodes).toEqual(expect.arrayContaining(['UNIVERSITY_MATCH', 'INTEREST_MATCH', 'GOAL_MATCH', 'LANGUAGE_MATCH', 'ARRIVAL_MATCH', 'NEWCOMER_FRIENDLY']));
  });
});

describe('selectTopCommunities', () => {
  it('sorts higher score first and respects top N', () => {
    const items = [
      { id: '00000000-0000-0000-0000-000000000003', score: 10 },
      { id: '00000000-0000-0000-0000-000000000001', score: 50 },
      { id: '00000000-0000-0000-0000-000000000002', score: 30 },
    ];
    const top = selectTopCommunities(items, 2);
    expect(top.map((i) => i.id)).toEqual(['00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002']);
  });

  it('defaults to top 5', () => {
    const items = Array.from({ length: 10 }, (_, i) => ({ id: `00000000-0000-0000-0000-00000000000${i}`, score: 10 + i }));
    const top = selectTopCommunities(items);
    expect(top).toHaveLength(5);
    expect(top[0]!.score).toBe(19);
  });

  it('breaks ties deterministically by id', () => {
    const a = { id: '00000000-0000-0000-0000-000000000001', score: 20 };
    const b = { id: '00000000-0000-0000-0000-000000000002', score: 20 };
    const top = selectTopCommunities([b, a], 2);
    expect(top[0]!.id).toBe(a.id);
    expect(top[1]!.id).toBe(b.id);
  });
});
