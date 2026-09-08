import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import { buildGroundedContext, validateGroundedResponse } from '../ai.grounding.js'

// ─── Unit tests: grounding ──────────────────────────────────────────────────

describe('buildGroundedContext', () => {
  const profile = { languages: ['English'], interests: ['Employment'], targetCountry: 'USA' }
  const communities = [{ id: 'comm-1', name: 'Community One', description: 'desc', isVerified: true }]
  const resources = [{ id: 'res-1', title: 'Resource One', description: 'desc', isVerified: false }]
  const opportunities = [{ id: 'opp-1', title: 'Opportunity One', description: 'desc', isVerified: false }]

  it('includes every approved entity ID', () => {
    const prompt = buildGroundedContext(profile, communities, resources, opportunities)
    expect(prompt).toContain('comm-1')
    expect(prompt).toContain('res-1')
    expect(prompt).toContain('opp-1')
  })

  it('includes the grounding instruction forbidding invented entities', () => {
    const prompt = buildGroundedContext(profile, communities, resources, opportunities)
    expect(prompt).toContain('Do NOT invent any entity')
    expect(prompt).toContain('Do NOT claim any verification status not listed')
  })
})

describe('validateGroundedResponse', () => {
  const approvedIds = new Set(['comm-1', 'res-1', 'opp-1'])

  it('accepts valid IDs referencing approved entities', () => {
    const response = {
      explanation: 'Here is why',
      navigationAdvice: 'Go here first',
      rankedCommunities: [{ id: 'comm-1', reason: 'good fit' }],
      rankedResources: [{ id: 'res-1', reason: 'useful' }],
      rankedOpportunities: [{ id: 'opp-1', reason: 'relevant' }],
    }
    const result = validateGroundedResponse(response, approvedIds)
    expect(result.rankedCommunities).toHaveLength(1)
    expect(result.rankedResources).toHaveLength(1)
    expect(result.rankedOpportunities).toHaveLength(1)
    expect(result.rejectedIds).toHaveLength(0)
  })

  it('rejects invented IDs not present in the approved set', () => {
    const response = {
      explanation: 'Here is why',
      navigationAdvice: 'Go here first',
      rankedCommunities: [
        { id: 'comm-1', reason: 'good fit' },
        { id: 'invented-comm', reason: 'made up' },
      ],
      rankedResources: [{ id: 'invented-res', reason: 'made up' }],
      rankedOpportunities: [],
    }
    const result = validateGroundedResponse(response, approvedIds)
    expect(result.rankedCommunities).toHaveLength(1)
    expect(result.rankedCommunities[0]?.id).toBe('comm-1')
    expect(result.rankedResources).toHaveLength(0)
    expect(result.rejectedIds).toContain('invented-comm')
    expect(result.rejectedIds).toContain('invented-res')
  })

  it('throws on malformed AI output', () => {
    expect(() => validateGroundedResponse({ foo: 'bar' }, approvedIds)).toThrow()
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

vi.mock('../ai.service.js', () => ({
  navigate: vi.fn(),
}))

import * as aiService from '../ai.service.js'
import { createApp } from '../../../app.js'

describe('AI Navigator API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('POST /api/v1/ai/navigate without auth returns 401', async () => {
    const { UnauthorizedError } = await import('../../../shared/errors/AppError.js')
    const testApp = express()
    testApp.use(express.json())
    testApp.use((_req: any, _res: any, next: any) => next(new UnauthorizedError()))
    testApp.use((_err: any, _req: any, res: any, _next: any) => {
      res.status(401).json({ error: { code: 'UNAUTHORIZED' } })
    })
    testApp.post('/api/v1/ai/navigate', (_req: any, res: any) => res.json({ data: {} }))
    const res = await request(testApp).post('/api/v1/ai/navigate').send({ query: 'help me' })
    expect(res.status).toBe(401)
  })

  it('POST /api/v1/ai/navigate with missing query returns 400', async () => {
    const { app } = createApp()
    const res = await request(app).post('/api/v1/ai/navigate').send({})
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('POST /api/v1/ai/navigate with query over 500 chars returns 400', async () => {
    const { app } = createApp()
    const res = await request(app)
      .post('/api/v1/ai/navigate')
      .send({ query: 'a'.repeat(501) })
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('POST /api/v1/ai/navigate with valid query returns 200', async () => {
    vi.mocked(aiService.navigate).mockResolvedValue({
      explanation: 'explanation text',
      navigationAdvice: 'advice text',
      communities: [{ id: 'comm-1' }],
      resources: [],
      opportunities: [],
      aiAvailable: true,
    })
    const { app } = createApp()
    const res = await request(app).post('/api/v1/ai/navigate').send({ query: 'help me find housing' })
    expect(res.status).toBe(200)
    expect(res.body.data.explanation).toBe('explanation text')
    expect(res.body.meta.aiAvailable).toBe(true)
  })

  it('includes rate limit headers on the navigate endpoint', async () => {
    vi.mocked(aiService.navigate).mockResolvedValue({
      explanation: '',
      navigationAdvice: '',
      communities: [],
      resources: [],
      opportunities: [],
      aiAvailable: false,
    })
    const { app } = createApp()
    const res = await request(app).post('/api/v1/ai/navigate').send({ query: 'help' })
    expect(res.headers['ratelimit-limit']).toBeDefined()
  })
})
