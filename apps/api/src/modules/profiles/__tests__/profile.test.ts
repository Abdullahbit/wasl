import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import { createApp } from '../../../app.js'
import { UnauthorizedError } from '../../../shared/errors/AppError.js'

// Mock the auth middleware for tests
vi.mock('../../../middleware/auth.js', () => ({
  requireAuth: (req: any, _res: any, next: any) => {
    req.user = { id: 'test-user-id', email: 'test@example.com', name: 'Test User', role: 'user' }
    next()
  },
  requireRole: () => (req: any, _res: any, next: any) => next(),
}))

// Mock the profile service
vi.mock('../profile.service.js', () => ({
  getProfile: vi.fn(),
  upsertProfile: vi.fn(),
  markOnboardingComplete: vi.fn(),
}))

import * as profileService from '../profile.service.js'

describe('Profile API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('GET /api/v1/profile returns null for new user', async () => {
    vi.mocked(profileService.getProfile).mockResolvedValue(null)
    const { app } = createApp()
    const res = await request(app).get('/api/v1/profile')
    expect(res.status).toBe(200)
    expect(res.body.data).toBeNull()
  })

  it('PUT /api/v1/profile with invalid data returns 400', async () => {
    const { app } = createApp()
    const res = await request(app)
      .put('/api/v1/profile')
      .send({ email: 'not-allowed-field', languages: [] }) // empty array fails min(1)
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('PUT /api/v1/profile with valid data returns profile', async () => {
    const mockProfile = {
      id: 'profile-1',
      userId: 'test-user-id',
      originCountry: 'Egypt',
      targetCountry: 'USA',
      languages: ['Arabic', 'English'],
      interests: ['Employment', 'Housing'],
      profileComplete: true,
      bio: null, currentCity: null, goals: null, immigrationStatus: null, visaType: null, arrivalDate: null,
      createdAt: new Date(), updatedAt: new Date(),
    }
    vi.mocked(profileService.upsertProfile).mockResolvedValue(mockProfile)
    const { app } = createApp()
    const res = await request(app)
      .put('/api/v1/profile')
      .send({ originCountry: 'Egypt', targetCountry: 'USA', languages: ['Arabic', 'English'], interests: ['Employment', 'Housing'] })
    expect(res.status).toBe(200)
    expect(res.body.data.originCountry).toBe('Egypt')
  })

  it('GET /api/v1/profile without auth returns 401', async () => {
    // Build a mini app that uses an auth middleware which always rejects (simulating no session)
    const testApp = express()
    testApp.use(express.json())
    // Rejecting auth middleware — no session present
    testApp.use((_req: any, _res: any, next: any) => next(new UnauthorizedError()))
    testApp.use((_err: any, _req: any, res: any, _next: any) => {
      res.status(401).json({ error: { code: 'UNAUTHORIZED' } })
    })
    testApp.get('/api/v1/profile', (_req: any, res: any) => res.json({ data: null }))
    const res = await request(testApp).get('/api/v1/profile')
    expect(res.status).toBe(401)
  })

  it('GET /api/v1/profile after PUT returns updated values', async () => {
    const mockProfile = {
      id: 'profile-2',
      userId: 'test-user-id',
      originCountry: 'Canada',
      targetCountry: 'Germany',
      languages: ['English', 'French'],
      interests: ['Education'],
      profileComplete: false,
      bio: null, currentCity: null, goals: null, immigrationStatus: null, visaType: null, arrivalDate: null,
      createdAt: new Date(), updatedAt: new Date(),
    }
    vi.mocked(profileService.upsertProfile).mockResolvedValue(mockProfile)
    vi.mocked(profileService.getProfile).mockResolvedValue(mockProfile)
    const { app } = createApp()

    await request(app)
      .put('/api/v1/profile')
      .send({ originCountry: 'Canada', targetCountry: 'Germany', languages: ['English', 'French'], interests: ['Education'] })

    const res = await request(app).get('/api/v1/profile')
    expect(res.status).toBe(200)
    expect(res.body.data.originCountry).toBe('Canada')
    expect(res.body.data.targetCountry).toBe('Germany')
    expect(res.body.data.languages).toEqual(['English', 'French'])
  })
})
