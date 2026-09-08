/**
 * API-level tests for POST /api/v1/ai/navigate
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

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

import request from 'supertest';
import { app } from '../../../app.js';

const mockProfile = {
  id: '00000000-0000-0000-0000-000000000100',
  userId: 'user-1',
  university: 'Beykoz University',
  interests: ['Software'],
  goals: ['Networking'],
  turkishLevel: 'Beginner',
  arrivalStage: 'First Week',
};

function makeCommunity(id: string) {
  return {
    id,
    name: 'Test',
    description: 'Desc',
    category: 'technology',
    languages: ['English'],
    universities: ['Beykoz University'],
    interests: ['Software'],
    location: 'Istanbul',
    targetAudience: 'Networking',
    newcomerFriendly: true,
    verified: true,
    lastReviewed: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

vi.mock('../../../db/prisma.js', () => ({
  prisma: {
    profile: { findUnique: vi.fn() },
    community: { findMany: vi.fn() },
  },
}));

vi.mock('../../auth/auth.middleware.js', () => ({
  requireAuthenticatedUser: (_req: unknown, res: { locals: Record<string, unknown> }, next: () => void) => {
    (res.locals as Record<string, unknown>).session = { user: { id: 'user-1' } };
    next();
  },
}));

import { prisma } from '../../../db/prisma.js';

describe('POST /api/v1/ai/navigate', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 200 with safe response on provider success (fallback when no key)', async () => {
    (prisma.profile.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockProfile);
    (prisma.community.findMany as unknown as ReturnType<typeof vi.fn>).mockResolvedValue([
      makeCommunity('00000000-0000-0000-0000-000000000011'),
    ]);

    const res = await request(app).post('/api/v1/ai/navigate').send({});
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.deterministic).toBeDefined();
    // fallback warning when no key
    expect(res.body.data.warning).toBeDefined();
  });

  it('handles missing profile with 409', async () => {
    (prisma.profile.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const res = await request(app).post('/api/v1/ai/navigate').send({});
    expect(res.status).toBe(409);
  });

  it('validates request body (strict empty)', async () => {
    (prisma.profile.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockProfile);
    (prisma.community.findMany as unknown as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    const res = await request(app).post('/api/v1/ai/navigate').send({ unexpected: 'field' });
    expect(res.status).toBe(400);
  });

  it('does not crash on provider failure and returns deterministic', async () => {
    (prisma.profile.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockProfile);
    (prisma.community.findMany as unknown as ReturnType<typeof vi.fn>).mockResolvedValue([
      makeCommunity('00000000-0000-0000-0000-000000000011'),
    ]);
    const res = await request(app).post('/api/v1/ai/navigate').send({});
    expect(res.status).toBe(200);
    expect(res.body.data.deterministic.length).toBeGreaterThan(0);
    // ensure no hallucinated IDs leak (deterministic ids are valid)
    expect(res.body.data.deterministic[0].communityId).toBe('00000000-0000-0000-0000-000000000011');
  });
});
