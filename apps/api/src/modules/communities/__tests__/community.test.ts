import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import { createApp } from '../../../app.js'

vi.mock('../community.service.js', () => ({
  getCommunities: vi.fn(),
  getCommunity: vi.fn(),
  getCommunityBySlug: vi.fn(),
  getCandidatesForProfile: vi.fn(),
}))

import * as communityService from '../community.service.js'

const mockCommunity = {
  id: 'comm-1',
  name: 'Test Community',
  slug: 'test-community',
  description: 'A test community',
  websiteUrl: null,
  contactEmail: null,
  joinUrl: null,
  memberCount: 100,
  isVerified: true,
  verificationStatus: 'VERIFIED',
  category: { id: 'cat-1', name: 'Employment', slug: 'employment' },
  languages: [{ id: 'lang-1', code: 'en', name: 'English' }],
  interests: [{ id: 'int-1', name: 'Networking', slug: 'networking' }],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

describe('Community API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('GET /api/v1/communities returns list with pagination', async () => {
    vi.mocked(communityService.getCommunities).mockResolvedValue({
      data: [mockCommunity],
      meta: { page: 1, limit: 20, total: 1, totalPages: 1 },
    })
    const { app } = createApp()
    const res = await request(app).get('/api/v1/communities')
    expect(res.status).toBe(200)
    expect(res.body.data).toHaveLength(1)
    expect(res.body.meta.page).toBe(1)
    expect(res.body.meta.limit).toBe(20)
  })

  it('GET /api/v1/communities?categoryId=x filters work', async () => {
    vi.mocked(communityService.getCommunities).mockResolvedValue({
      data: [mockCommunity],
      meta: { page: 1, limit: 20, total: 1, totalPages: 1 },
    })
    const { app } = createApp()
    const res = await request(app).get('/api/v1/communities?categoryId=cat-1')
    expect(res.status).toBe(200)
    expect(communityService.getCommunities).toHaveBeenCalledWith(
      expect.objectContaining({ categoryId: 'cat-1' }),
    )
  })

  it('GET /api/v1/communities/:id returns 404 when not found', async () => {
    const { NotFoundError } = await import('../../../shared/errors/AppError.js')
    vi.mocked(communityService.getCommunity).mockRejectedValue(new NotFoundError('Community'))
    const { app } = createApp()
    const res = await request(app).get('/api/v1/communities/nonexistent')
    expect(res.status).toBe(404)
    expect(res.body.error.code).toBe('NOT_FOUND')
  })

  it('GET /api/v1/communities/:id returns community with relations', async () => {
    vi.mocked(communityService.getCommunity).mockResolvedValue(mockCommunity)
    const { app } = createApp()
    const res = await request(app).get('/api/v1/communities/comm-1')
    expect(res.status).toBe(200)
    expect(res.body.data.id).toBe('comm-1')
    expect(res.body.data.category).toEqual({ id: 'cat-1', name: 'Employment', slug: 'employment' })
    expect(res.body.data.languages).toHaveLength(1)
    expect(res.body.data.interests).toHaveLength(1)
    expect(res.body.data.verificationStatus).toBe('VERIFIED')
  })

  it('GET /api/v1/communities/slug/:slug returns community', async () => {
    vi.mocked(communityService.getCommunityBySlug).mockResolvedValue(mockCommunity)
    const { app } = createApp()
    const res = await request(app).get('/api/v1/communities/slug/test-community')
    expect(res.status).toBe(200)
    expect(res.body.data.slug).toBe('test-community')
  })

  it('GET /api/v1/communities does not require auth', async () => {
    vi.mocked(communityService.getCommunities).mockResolvedValue({
      data: [],
      meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
    })
    const { app } = createApp()
    const res = await request(app).get('/api/v1/communities')
    expect(res.status).toBe(200)
  })
})
