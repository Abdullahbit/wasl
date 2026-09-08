import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import { ForbiddenError } from '../../../shared/errors/AppError.js'

let currentRole = 'user'

vi.mock('../../../middleware/auth.js', () => ({
  requireAuth: (req: any, _res: any, next: any) => {
    req.user = { id: 'test-user-id', email: 'test@example.com', name: 'Test User', role: currentRole }
    next()
  },
  requireRole: (role: string) => (req: any, _res: any, next: any) => {
    req.user = { id: 'test-user-id', email: 'test@example.com', name: 'Test User', role: currentRole }
    if (currentRole !== role && currentRole !== 'admin') {
      next(new ForbiddenError())
      return
    }
    next()
  },
}))

vi.mock('../verification.service.js', () => ({
  getVerificationStatus: vi.fn(),
  verifyEntity: vi.fn(),
}))

import { createApp } from '../../../app.js'
import * as verificationService from '../verification.service.js'

describe('Verification API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    currentRole = 'user'
  })

  it('GET /api/v1/verification/:entityType/:entityId is public and returns status', async () => {
    vi.mocked(verificationService.getVerificationStatus).mockResolvedValue({
      id: 'ver-1',
      entityType: 'RESOURCE',
      entityId: 'res-1',
      status: 'VERIFIED',
      verifiedAt: new Date(),
      verifiedBy: 'admin-1',
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any)
    const { app } = createApp()
    const res = await request(app).get('/api/v1/verification/RESOURCE/res-1')
    expect(res.status).toBe(200)
    expect(res.body.data.status).toBe('VERIFIED')
  })

  it('GET returns UNVERIFIED placeholder when no record exists', async () => {
    vi.mocked(verificationService.getVerificationStatus).mockResolvedValue(null)
    const { app } = createApp()
    const res = await request(app).get('/api/v1/verification/RESOURCE/res-2')
    expect(res.status).toBe(200)
    expect(res.body.data.status).toBe('UNVERIFIED')
  })

  it('POST verify as non-admin returns 403', async () => {
    currentRole = 'user'
    const { app } = createApp()
    const res = await request(app)
      .post('/api/v1/verification/RESOURCE/res-1/verify')
      .send({ notes: 'looks good' })
    expect(res.status).toBe(403)
    expect(verificationService.verifyEntity).not.toHaveBeenCalled()
  })

  it('POST verify as admin succeeds', async () => {
    currentRole = 'admin'
    vi.mocked(verificationService.verifyEntity).mockResolvedValue({
      id: 'ver-1',
      entityType: 'RESOURCE',
      entityId: 'res-1',
      status: 'VERIFIED',
      verifiedAt: new Date(),
      verifiedBy: 'test-user-id',
      notes: 'looks good',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any)
    const { app } = createApp()
    const res = await request(app)
      .post('/api/v1/verification/RESOURCE/res-1/verify')
      .send({ notes: 'looks good' })
    expect(res.status).toBe(200)
    expect(res.body.data.status).toBe('VERIFIED')
    expect(verificationService.verifyEntity).toHaveBeenCalledWith(
      'RESOURCE',
      'res-1',
      'test-user-id',
      'looks good',
    )
  })

  it('GET with invalid entityType returns 400', async () => {
    const { app } = createApp()
    const res = await request(app).get('/api/v1/verification/NOT_REAL/res-1')
    expect(res.status).toBe(400)
  })
})
