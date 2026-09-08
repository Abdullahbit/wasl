import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import { createApp } from '../../../app.js'

vi.mock('../opportunity.service.js', () => ({
  getOpportunities: vi.fn(),
  getOpportunity: vi.fn(),
  getCandidatesForProfile: vi.fn(),
}))

import * as opportunityService from '../opportunity.service.js'

const mockOpportunity = {
  id: 'opp-1',
  title: 'Test Opportunity',
  slug: 'test-opportunity',
  description: 'A test opportunity',
  type: 'JOB',
  organizationName: 'Acme Corp',
  applicationUrl: 'https://example.com/apply',
  deadline: null,
  isVerified: true,
  verificationStatus: 'VERIFIED',
  targetCountry: 'US',
  requirements: null,
  interests: [{ id: 'int-1', name: 'Networking' }],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

describe('Opportunity API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('GET /api/v1/opportunities returns list with pagination', async () => {
    vi.mocked(opportunityService.getOpportunities).mockResolvedValue({
      data: [mockOpportunity],
      meta: { page: 1, limit: 20, total: 1, totalPages: 1 },
    })
    const { app } = createApp()
    const res = await request(app).get('/api/v1/opportunities')
    expect(res.status).toBe(200)
    expect(res.body.data).toHaveLength(1)
    expect(res.body.meta.page).toBe(1)
    expect(res.body.meta.limit).toBe(20)
  })

  it('GET /api/v1/opportunities?type=JOB filters work', async () => {
    vi.mocked(opportunityService.getOpportunities).mockResolvedValue({
      data: [mockOpportunity],
      meta: { page: 1, limit: 20, total: 1, totalPages: 1 },
    })
    const { app } = createApp()
    const res = await request(app).get('/api/v1/opportunities?type=JOB')
    expect(res.status).toBe(200)
    expect(opportunityService.getOpportunities).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'JOB' }),
    )
  })

  it('GET /api/v1/opportunities/:id returns 404 when not found', async () => {
    const { NotFoundError } = await import('../../../shared/errors/AppError.js')
    vi.mocked(opportunityService.getOpportunity).mockRejectedValue(
      new NotFoundError('Opportunity'),
    )
    const { app } = createApp()
    const res = await request(app).get('/api/v1/opportunities/nonexistent')
    expect(res.status).toBe(404)
    expect(res.body.error.code).toBe('NOT_FOUND')
  })

  it('GET /api/v1/opportunities/:id returns opportunity with relations', async () => {
    vi.mocked(opportunityService.getOpportunity).mockResolvedValue(mockOpportunity)
    const { app } = createApp()
    const res = await request(app).get('/api/v1/opportunities/opp-1')
    expect(res.status).toBe(200)
    expect(res.body.data.id).toBe('opp-1')
    expect(res.body.data.organizationName).toBe('Acme Corp')
    expect(res.body.data.interests).toHaveLength(1)
    expect(res.body.data.verificationStatus).toBe('VERIFIED')
  })

  it('GET /api/v1/opportunities does not require auth', async () => {
    vi.mocked(opportunityService.getOpportunities).mockResolvedValue({
      data: [],
      meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
    })
    const { app } = createApp()
    const res = await request(app).get('/api/v1/opportunities')
    expect(res.status).toBe(200)
  })
})
