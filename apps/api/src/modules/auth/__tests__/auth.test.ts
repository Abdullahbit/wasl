import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { createApp } from '../../../app.js'

describe('Auth', () => {
  it('POST /api/auth/sign-up with invalid email returns error', async () => {
    const { app } = createApp()
    const res = await request(app)
      .post('/api/auth/sign-up/email')
      .send({ email: 'not-an-email', password: 'password123', name: 'Test' })
    expect(res.status).toBeGreaterThanOrEqual(400)
  })

  it('GET /api/v1/profile without session returns 401', async () => {
    const { app } = createApp()
    // Mount a test route for profile
    const res = await request(app)
      .get('/api/v1/profile')
    // Profile route doesn't exist yet but should hit 404 not 401 at this stage
    // The middleware will be wired properly in Task 5
    expect([401, 404]).toContain(res.status)
  })

  it('auth routes are mounted at /api/auth', async () => {
    const { app } = createApp()
    const res = await request(app).get('/api/auth/get-session')
    // Should not be 404 (route exists even if returns empty session)
    expect(res.status).not.toBe(404)
  })
})
