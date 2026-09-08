import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import { createApp } from '../../../app.js'
import { scoreCommunity } from '../scoring/community.scorer.js'
import { scoreResource } from '../scoring/resource.scorer.js'
import { scoreOpportunity } from '../scoring/opportunity.scorer.js'

// ─── Unit tests: pure scorers ──────────────────────────────────────────────

describe('scoreCommunity', () => {
  const profile = { languages: ['English'], interests: ['Employment', 'Housing'], targetCountry: 'USA' }

  it('adds +3 when a language matches', () => {
    const community = {
      languages: [{ code: 'en', name: 'English' }],
      interests: [],
      isVerified: false,
      memberCount: null,
    }
    expect(scoreCommunity(community, profile)).toBe(3)
  })

  it('adds no language bonus when languages do not match', () => {
    const community = {
      languages: [{ code: 'fr', name: 'French' }],
      interests: [],
      isVerified: false,
      memberCount: null,
    }
    expect(scoreCommunity(community, profile)).toBe(0)
  })

  it('adds +2 per overlapping interest, capped at +6', () => {
    const community = {
      languages: [],
      interests: [
        { name: 'Employment' },
        { name: 'Housing' },
        { name: 'Education' },
        { name: 'Legal' },
      ],
      isVerified: false,
      memberCount: null,
    }
    // Only Employment + Housing overlap = 2 * 2 = 4 (under cap)
    expect(scoreCommunity(community, profile)).toBe(4)
  })

  it('caps interest bonus at +6 even with many overlaps', () => {
    const wideProfile = { languages: [], interests: ['A', 'B', 'C', 'D', 'E'], targetCountry: null }
    const community = {
      languages: [],
      interests: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }],
      isVerified: false,
      memberCount: null,
    }
    expect(scoreCommunity(community, wideProfile)).toBe(6)
  })

  it('adds +1 when verified', () => {
    const community = { languages: [], interests: [], isVerified: true, memberCount: null }
    expect(scoreCommunity(community, profile)).toBe(1)
  })

  it('adds +1 when memberCount > 100', () => {
    const community = { languages: [], interests: [], isVerified: false, memberCount: 150 }
    expect(scoreCommunity(community, profile)).toBe(1)
  })

  it('does not add member bonus when memberCount <= 100', () => {
    const community = { languages: [], interests: [], isVerified: false, memberCount: 100 }
    expect(scoreCommunity(community, profile)).toBe(0)
  })

  it('combines all bonuses', () => {
    const community = {
      languages: [{ code: 'en', name: 'English' }],
      interests: [{ name: 'Employment' }, { name: 'Housing' }, { name: 'Legal' }],
      isVerified: true,
      memberCount: 500,
    }
    // 3 (language) + 4 (2 matching interests: Employment, Housing) + 1 (verified) + 1 (member) = 9
    expect(scoreCommunity(community, profile)).toBe(9)
  })
})

describe('scoreResource', () => {
  const profile = { languages: [], interests: ['Employment', 'Housing'], targetCountry: null }

  it('adds +2 per overlapping interest', () => {
    const resource = { interests: [{ name: 'Employment' }], isVerified: false }
    expect(scoreResource(resource, profile)).toBe(2)
  })

  it('caps interest bonus at +6', () => {
    const wideProfile = { languages: [], interests: ['A', 'B', 'C', 'D'], targetCountry: null }
    const resource = {
      interests: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }],
      isVerified: false,
    }
    expect(scoreResource(resource, wideProfile)).toBe(6)
  })

  it('adds +1 when verified', () => {
    const resource = { interests: [], isVerified: true }
    expect(scoreResource(resource, profile)).toBe(1)
  })

  it('returns 0 for no overlap and not verified', () => {
    const resource = { interests: [{ name: 'Unrelated' }], isVerified: false }
    expect(scoreResource(resource, profile)).toBe(0)
  })
})

describe('scoreOpportunity', () => {
  const profile = { languages: [], interests: ['Employment'], targetCountry: 'USA' }

  it('adds +2 per overlapping interest', () => {
    const opportunity = { interests: [{ name: 'Employment' }], isVerified: false, targetCountry: null }
    expect(scoreOpportunity(opportunity, profile)).toBe(2)
  })

  it('adds +1 when targetCountry matches', () => {
    const opportunity = { interests: [], isVerified: false, targetCountry: 'USA' }
    expect(scoreOpportunity(opportunity, profile)).toBe(1)
  })

  it('does not add country bonus on mismatch', () => {
    const opportunity = { interests: [], isVerified: false, targetCountry: 'Canada' }
    expect(scoreOpportunity(opportunity, profile)).toBe(0)
  })

  it('adds +1 when verified', () => {
    const opportunity = { interests: [], isVerified: true, targetCountry: null }
    expect(scoreOpportunity(opportunity, profile)).toBe(1)
  })

  it('combines all bonuses', () => {
    const opportunity = { interests: [{ name: 'Employment' }], isVerified: true, targetCountry: 'USA' }
    expect(scoreOpportunity(opportunity, profile)).toBe(4)
  })
})

// ─── Integration tests: router ─────────────────────────────────────────────

vi.mock('../../../middleware/auth.js', () => ({
  requireAuth: (req: any, _res: any, next: any) => {
    req.user = { id: 'test-user-id', email: 'test@example.com', name: 'Test User', role: 'user' }
    next()
  },
  requireRole: () => (req: any, _res: any, next: any) => next(),
}))

vi.mock('../recommendation.service.js', () => ({
  getRecommendations: vi.fn(),
}))

import * as recommendationService from '../recommendation.service.js'
import { ValidationError } from '../../../shared/errors/AppError.js'

describe('Recommendation API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('GET /api/v1/recommendations without auth returns 401', async () => {
    // Build a mini app with a rejecting auth middleware (no session), mirroring the
    // pattern used by the profile module's own 401 test.
    const { UnauthorizedError } = await import('../../../shared/errors/AppError.js')
    const testApp = express()
    testApp.use(express.json())
    testApp.use((_req: any, _res: any, next: any) => next(new UnauthorizedError()))
    testApp.use((_err: any, _req: any, res: any, _next: any) => {
      res.status(401).json({ error: { code: 'UNAUTHORIZED' } })
    })
    testApp.get('/api/v1/recommendations', (_req: any, res: any) => res.json({ data: {} }))
    const res = await request(testApp).get('/api/v1/recommendations')
    expect(res.status).toBe(401)
  })

  it('GET /api/v1/recommendations with incomplete profile returns 400', async () => {
    vi.mocked(recommendationService.getRecommendations).mockRejectedValue(
      new ValidationError('Profile must be complete before requesting recommendations'),
    )
    const { app } = createApp()
    const res = await request(app).get('/api/v1/recommendations')
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('GET /api/v1/recommendations with complete profile returns 200 with recommendations', async () => {
    vi.mocked(recommendationService.getRecommendations).mockResolvedValue({
      data: {
        communities: [{ id: 'comm-1', score: 10 }],
        resources: [{ id: 'res-1', score: 5 }],
        opportunities: [{ id: 'opp-1', score: 4 }],
      },
      meta: { generatedAt: new Date().toISOString(), algorithm: 'deterministic-v1' },
    } as any)
    const { app } = createApp()
    const res = await request(app).get('/api/v1/recommendations')
    expect(res.status).toBe(200)
    expect(res.body.data.communities).toHaveLength(1)
    expect(res.body.data.resources).toHaveLength(1)
    expect(res.body.data.opportunities).toHaveLength(1)
    expect(res.body.meta.algorithm).toBe('deterministic-v1')
  })
})
