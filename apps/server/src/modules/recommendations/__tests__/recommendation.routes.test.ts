/**
 * API-level tests for GET /api/v1/recommendations
 *
 * Uses mocked auth and Prisma to verify deterministic contract, topN, reasonCodes, and safe response.
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

function makeCommunity(id: string, overrides: Record<string, unknown> = {}) {
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
    ...overrides,
  };
}

vi.mock('../../../db/prisma.js', () => ({
  prisma: {
    profile: { findUnique: vi.fn() },
    community: { findMany: vi.fn() },
  },
}));

vi.mock('../../auth/auth.middleware.js', () => ({
  requireAuthenticatedUser: (_req: unknown, res: { locals: Record<string, unknown>; status: (n: number) => unknown }, next: () => void) => {
    (res.locals as Record<string, unknown>).session = { user: { id: 'user-1' } };
    next();
  },
}));

import { prisma } from '../../../db/prisma.js';

describe('GET /api/v1/recommendations', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 200 with recommendations, reasonCodes and no private fields', async () => {
    (prisma.profile.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockProfile);
    (prisma.community.findMany as unknown as ReturnType<typeof vi.fn>).mockResolvedValue([
      makeCommunity('00000000-0000-0000-0000-000000000011'),
      makeCommunity('00000000-0000-0000-0000-000000000012', { universities: ['Other'] }),
    ]);

    const res = await request(app).get('/api/v1/recommendations');
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].score.reasonCodes).toEqual(expect.arrayContaining(['UNIVERSITY_MATCH']));
    // no internal fields like password
    expect(res.body.data[0].community).not.toHaveProperty('password');
  });

  it('respects top N (default 5) and tie-break by id', async () => {
    (prisma.profile.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockProfile);
    const communities = Array.from({ length: 7 }, (_, i) =>
      makeCommunity(`00000000-0000-0000-0000-0000000000${(10 + i).toString().padStart(2, '0')}`),
    );
    (prisma.community.findMany as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(communities);

    const res = await request(app).get('/api/v1/recommendations');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(5);
    // deterministic tie-break: ids sorted asc when scores equal
    const ids = res.body.data.map((d: { communityId: string }) => d.communityId);
    const sorted = [...ids].sort();
    expect(ids).toEqual(sorted);
  });

  it('handles empty candidate case safely', async () => {
    (prisma.profile.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockProfile);
    (prisma.community.findMany as unknown as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    const res = await request(app).get('/api/v1/recommendations');
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  it('returns 409 when profile missing', async () => {
    (prisma.profile.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const res = await request(app).get('/api/v1/recommendations');
    expect(res.status).toBe(409);
  });
});

describe('POST /api/v1/recommendations', () => {
  beforeEach(() => vi.clearAllMocks());

  it('valid empty body returns 200 with deterministic recommendations and reasonCodes', async () => {
    (prisma.profile.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockProfile);
    (prisma.community.findMany as unknown as ReturnType<typeof vi.fn>).mockResolvedValue([
      makeCommunity('11111111-1111-4111-8111-111111111111'),
      makeCommunity('22222222-2222-4222-8222-222222222222', { universities: ['Other'] }),
    ]);

    const res = await request(app).post('/api/v1/recommendations').send({});
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data[0].score.reasonCodes).toEqual(expect.arrayContaining(['UNIVERSITY_MATCH']));
    expect(res.body.data[0].communityId).toBeDefined();
  });

  it('invalid body with extra field returns 400', async () => {
    const res = await request(app).post('/api/v1/recommendations').send({ unexpected: 'field' });
    expect(res.status).toBe(400);
  });

  it('respects top N and deterministic ordering via POST', async () => {
    (prisma.profile.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockProfile);
    const communities = Array.from({ length: 7 }, (_, i) =>
      makeCommunity(`33333333-3333-4333-8333-33333333333${i}`),
    );
    (prisma.community.findMany as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(communities);

    const res = await request(app).post('/api/v1/recommendations').send({});
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(5);
    const ids = res.body.data.map((d: { communityId: string }) => d.communityId);
    const sorted = [...ids].sort();
    expect(ids).toEqual(sorted);
  });

  it('returns 409 when profile missing via POST', async () => {
    (prisma.profile.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const res = await request(app).post('/api/v1/recommendations').send({});
    expect(res.status).toBe(409);
  });
});
