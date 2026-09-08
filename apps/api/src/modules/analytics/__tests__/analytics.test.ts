import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'

vi.mock('../../../middleware/auth.js', () => ({
  requireAuth: (req: any, _res: any, next: any) => {
    req.user = { id: 'test-user-id', email: 'test@example.com', name: 'Test User', role: 'user' }
    next()
  },
  requireRole: () => (req: any, _res: any, next: any) => next(),
}))

vi.mock('../analytics.repository.js', () => ({
  create: vi.fn().mockResolvedValue(undefined),
}))

import { createApp } from '../../../app.js'
import * as analyticsRepo from '../analytics.repository.js'
import * as analyticsService from '../analytics.service.js'
import { logger } from '../../../config/logger.js'

describe('analytics.service trackEvent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fires without throwing and writes to the repository', async () => {
    await expect(
      analyticsService.trackEvent('user-1', 'ONBOARDING_COMPLETE', { step: 3 }),
    ).resolves.toBeUndefined()
    expect(analyticsRepo.create).toHaveBeenCalledWith({
      userId: 'user-1',
      eventType: 'ONBOARDING_COMPLETE',
      properties: { step: 3 },
    })
  })

  it('never throws even when the repository write fails', async () => {
    vi.mocked(analyticsRepo.create).mockRejectedValueOnce(new Error('db down'))
    const logSpy = vi.spyOn(logger, 'error').mockImplementation(() => undefined as any)
    await expect(
      analyticsService.trackEvent(null, 'AI_NAVIGATE', {}),
    ).resolves.toBeUndefined()
    expect(logSpy).toHaveBeenCalled()
  })
})

describe('Analytics API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('POST /api/v1/analytics/track accepts a valid event and returns 202', async () => {
    const { app } = createApp()
    const res = await request(app)
      .post('/api/v1/analytics/track')
      .send({ eventType: 'RESOURCE_VIEW', properties: { resourceId: 'res-1' } })
    expect(res.status).toBe(202)
    // trackEvent is fire-and-forget; flush the microtask queue before asserting.
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(analyticsRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ eventType: 'RESOURCE_VIEW', userId: 'test-user-id' }),
    )
  })

  it('POST /api/v1/analytics/track rejects an invalid eventType', async () => {
    const { app } = createApp()
    const res = await request(app)
      .post('/api/v1/analytics/track')
      .send({ eventType: 'NOT_A_REAL_EVENT' })
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })
})
