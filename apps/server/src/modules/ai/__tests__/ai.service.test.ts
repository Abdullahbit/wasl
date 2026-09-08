/**
 * Tests AI navigator boundary: validation, allowlist, fallback, timeout, missing key.
 */

import { describe, it, expect, vi } from 'vitest';

vi.mock('../../../config/env.js', () => ({
  environment: {
    NODE_ENV: 'test',
    APP_URL: 'http://localhost:5173',
    DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
    DIRECT_URL: 'postgresql://test:test@localhost:5432/test',
    BETTER_AUTH_SECRET: 'a'.repeat(32),
    RESEND_API_KEY: undefined,
    EMAIL_FROM: 'test@test.com',
    AI_PROVIDER_API_KEY: undefined,
    AI_PROVIDER_MODEL: undefined,
  },
}));

import { generateRecommendations, AI_REQUEST_TIMEOUT_MILLISECONDS } from '../ai.service.js';
import type { Profile, Community } from '@prisma/client';

function makeProfile(): Profile {
  return {
    id: '00000000-0000-0000-0000-000000000100',
    userId: 'user-1',
    university: 'Beykoz University',
    interests: ['Software'],
    goals: ['Networking'],
    turkishLevel: 'Beginner',
    arrivalStage: 'First Week',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as Profile;
}

function makeCommunity(id: string, overrides: Partial<Community> = {}): Community {
  return {
    id,
    name: 'Test Community',
    description: 'Desc',
    category: 'technology',
    languages: ['English'],
    universities: ['Beykoz University'],
    interests: ['Software'],
    location: 'Istanbul',
    targetAudience: 'Networking Newcomers',
    newcomerFriendly: true,
    verified: true,
    lastReviewed: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as unknown as Community;
}

const approvedId = '11111111-1111-4111-8111-111111111111';
const approvedId2 = '22222222-2222-4222-8222-222222222222';
const fakeCommunityId = '33333333-3333-4333-8333-333333333333';
const fakeResourceId = '44444444-4444-4444-8444-444444444444';

describe('generateRecommendations AI boundary', () => {
  it('accepts valid NavigatorResponse and preserves approved IDs', async () => {
    const provider = {
      createNavigator: vi.fn().mockResolvedValue({
        summary: 'Welcome!',
        nextSteps: [
          { title: 'Join GDG', description: 'Go', priority: 'High' as const, reason: 'Matches Software', relatedCommunityId: approvedId },
          { title: 'Visit resource', description: 'Res', priority: 'Medium' as const, reason: 'Housing help' },
        ],
      }),
    };
    const result = await generateRecommendations(makeProfile(), [makeCommunity(approvedId)], provider);
    expect(result.navigator).toBeDefined();
    const nav = result.navigator!;
    expect(nav.nextSteps[0]!.relatedCommunityId).toBe(approvedId);
    expect(result.deterministic.length).toBeGreaterThan(0);
  });

  it('strips unknown community ID', async () => {
    const provider = {
      createNavigator: vi.fn().mockResolvedValue({
        summary: 'Hi',
        nextSteps: [
          { title: 'Fake', description: 'Fake', priority: 'High' as const, reason: 'Fake', relatedCommunityId: fakeCommunityId },
          { title: 'Real', description: 'Real', priority: 'High' as const, reason: 'Real', relatedCommunityId: approvedId },
        ],
      }),
    };
    const result = await generateRecommendations(makeProfile(), [makeCommunity(approvedId)], provider);
    const nav = result.navigator!;
    expect(nav.nextSteps.some((s) => s.relatedCommunityId === fakeCommunityId)).toBe(false);
    expect(nav.nextSteps.some((s) => s.relatedCommunityId === approvedId)).toBe(true);
  });

  it('strips unknown resource ID but keeps step', async () => {
    const provider = {
      createNavigator: vi.fn().mockResolvedValue({
        summary: 'Hi',
        nextSteps: [
          { title: 'Step', description: 'Desc', priority: 'High' as const, reason: 'Reason', relatedResourceId: fakeResourceId },
        ],
      }),
    };
    const result = await generateRecommendations(makeProfile(), [makeCommunity(approvedId)], provider);
    const nav = result.navigator!;
    expect(nav.nextSteps[0]!.relatedResourceId).toBeUndefined();
  });

  it('falls back on malformed JSON', async () => {
    const provider = {
      createNavigator: vi.fn().mockResolvedValue('not json at all'),
    };
    const result = await generateRecommendations(makeProfile(), [makeCommunity(approvedId)], provider);
    expect(result.navigator).toBeUndefined();
    expect(result.warning).toBeDefined();
    expect(result.deterministic.length).toBeGreaterThan(0);
  });

  it('falls back on schema-invalid object', async () => {
    const provider = {
      createNavigator: vi.fn().mockResolvedValue({ summary: 123, nextSteps: 'bad' }),
    };
    const result = await generateRecommendations(makeProfile(), [makeCommunity(approvedId)], provider);
    expect(result.navigator).toBeUndefined();
    expect(result.warning).toBeDefined();
  });

  it('falls back when missing required fields', async () => {
    const provider = {
      createNavigator: vi.fn().mockResolvedValue({ nextSteps: [] }),
    };
    const result = await generateRecommendations(makeProfile(), [makeCommunity(approvedId)], provider);
    expect(result.navigator).toBeUndefined();
  });

  it('times out via Promise.race + AbortSignal and falls back without throwing', async () => {
    vi.useFakeTimers();
    try {
      let capturedSignal: AbortSignal | null = null;
      const provider = {
        createNavigator: vi.fn().mockImplementation((_p: unknown, _c: unknown, signal: AbortSignal) => {
          capturedSignal = signal;
          return new Promise(() => {});
        }),
      };

      const promise = generateRecommendations(makeProfile(), [makeCommunity(approvedId)], provider);

      // Advance past the 15s production timeout without waiting real time
      await vi.advanceTimersByTimeAsync(AI_REQUEST_TIMEOUT_MILLISECONDS);

      const result = await promise;

      expect(capturedSignal).not.toBeNull();
      expect(capturedSignal!.aborted).toBe(true);
      expect(result.navigator).toBeUndefined();
      expect(result.warning).toBeDefined();
      expect(result.deterministic[0]!.communityId).toBe(approvedId);
      expect(result.deterministic.length).toBeGreaterThan(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it('handles missing API key via fallback', async () => {
    const provider = {
      createNavigator: vi.fn().mockRejectedValue(new Error('AI_PROVIDER_API_KEY is not configured')),
    };
    const result = await generateRecommendations(makeProfile(), [makeCommunity(approvedId)], provider);
    expect(result.navigator).toBeUndefined();
    expect(result.warning).toBeDefined();
    expect(result.deterministic[0]!.communityId).toBe(approvedId);
  });

  it('fallback response is valid and uses only approved IDs', async () => {
    const provider = {
      createNavigator: vi.fn().mockRejectedValue(new Error('fail')),
    };
    const communities = [makeCommunity(approvedId), makeCommunity(approvedId2)];
    const result = await generateRecommendations(makeProfile(), communities, provider);
    expect(result.deterministic.length).toBe(2);
    expect(result.deterministic.every((d) => [approvedId, approvedId2].includes(d.communityId))).toBe(true);
    expect(result.deterministic.every((d) => d.community.id === d.communityId)).toBe(true);
  });

  it('does not invent URLs/entities in fallback', async () => {
    const provider = {
      createNavigator: vi.fn().mockRejectedValue(new Error('fail')),
    };
    const result = await generateRecommendations(makeProfile(), [makeCommunity(approvedId)], provider);
    expect(result.navigator).toBeUndefined();
    expect(result.deterministic[0]!.community.id).toBe(approvedId);
  });
});
