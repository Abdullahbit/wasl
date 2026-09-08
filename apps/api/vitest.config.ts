import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    env: {
      NODE_ENV: 'test',
      PORT: '3001',
      APP_URL: 'http://localhost:3001',
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      DIRECT_URL: 'postgresql://test:test@localhost:5432/test',
      BETTER_AUTH_SECRET: 'test-secret-that-is-at-least-32-characters-long',
      BETTER_AUTH_URL: 'http://localhost:3001',
      RESEND_API_KEY: 're_test_key',
      RESEND_FROM_EMAIL: 'test@example.com',
      AI_PROVIDER: 'anthropic',
      AI_PROVIDER_API_KEY: 'test-api-key',
      AI_MODEL: 'claude-3-5-haiku-20241022',
    },
  },
})
