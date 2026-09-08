import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { createApp } from '../app.js'

describe('App', () => {
  it('GET /health returns ok', async () => {
    const { app } = createApp()
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok' })
  })

  it('unknown route returns 404 JSON error', async () => {
    const { app } = createApp()
    const res = await request(app).get('/api/v1/nonexistent')
    expect(res.status).toBe(404)
    expect(res.body.error.code).toBe('NOT_FOUND')
  })
})
