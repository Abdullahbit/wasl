import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import { createApp } from '../../../app.js'

vi.mock('../resource.service.js', () => ({
  getResources: vi.fn(),
  getResource: vi.fn(),
  getCandidatesForProfile: vi.fn(),
}))

import * as resourceService from '../resource.service.js'

const mockResource = {
  id: 'res-1',
  title: 'Test Resource',
  slug: 'test-resource',
  description: 'A test resource',
  url: 'https://example.com',
  type: 'ARTICLE',
  isVerified: true,
  verificationStatus: 'VERIFIED',
  category: { id: 'cat-1', name: 'Employment' },
  interests: [{ id: 'int-1', name: 'Networking' }],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

describe('Resource API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('GET /api/v1/resources returns list with pagination', async () => {
    vi.mocked(resourceService.getResources).mockResolvedValue({
      data: [mockResource],
      meta: { page: 1, limit: 20, total: 1, totalPages: 1 },
    })
    const { app } = createApp()
    const res = await request(app).get('/api/v1/resources')
    expect(res.status).toBe(200)
    expect(res.body.data).toHaveLength(1)
    expect(res.body.meta.page).toBe(1)
    expect(res.body.meta.limit).toBe(20)
  })

  it('GET /api/v1/resources?categoryId=x filters work', async () => {
    vi.mocked(resourceService.getResources).mockResolvedValue({
      data: [mockResource],
      meta: { page: 1, limit: 20, total: 1, totalPages: 1 },
    })
    const { app } = createApp()
    const res = await request(app).get('/api/v1/resources?categoryId=cat-1')
    expect(res.status).toBe(200)
    expect(resourceService.getResources).toHaveBeenCalledWith(
      expect.objectContaining({ categoryId: 'cat-1' }),
    )
  })

  it('GET /api/v1/resources/:id returns 404 when not found', async () => {
    const { NotFoundError } = await import('../../../shared/errors/AppError.js')
    vi.mocked(resourceService.getResource).mockRejectedValue(new NotFoundError('Resource'))
    const { app } = createApp()
    const res = await request(app).get('/api/v1/resources/nonexistent')
    expect(res.status).toBe(404)
    expect(res.body.error.code).toBe('NOT_FOUND')
  })

  it('GET /api/v1/resources/:id returns resource with relations', async () => {
    vi.mocked(resourceService.getResource).mockResolvedValue(mockResource)
    const { app } = createApp()
    const res = await request(app).get('/api/v1/resources/res-1')
    expect(res.status).toBe(200)
    expect(res.body.data.id).toBe('res-1')
    expect(res.body.data.category).toEqual({ id: 'cat-1', name: 'Employment' })
    expect(res.body.data.interests).toHaveLength(1)
    expect(res.body.data.verificationStatus).toBe('VERIFIED')
  })

  it('GET /api/v1/resources does not require auth', async () => {
    vi.mocked(resourceService.getResources).mockResolvedValue({
      data: [],
      meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
    })
    const { app } = createApp()
    const res = await request(app).get('/api/v1/resources')
    expect(res.status).toBe(200)
  })
})
