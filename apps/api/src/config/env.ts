import 'dotenv/config'
import { z } from 'zod'

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  APP_URL: z.string().url().default('http://localhost:3000'),
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url().default('http://localhost:3000'),
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().email().default('noreply@platform.example.com'),
  AI_PROVIDER: z.enum(['anthropic', 'openai']).default('anthropic'),
  // Optional: AI navigator falls back to deterministic recommendations when unset.
  AI_PROVIDER_API_KEY: z.string().min(1).optional().or(z.literal('')).transform(v => v || undefined),
  AI_MODEL: z.string().default('claude-3-5-haiku-20241022'),
  CORS_ORIGIN: z.string().optional(),
})

const parsed = EnvSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('Invalid environment variables:')
  console.error(parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const env = parsed.data
export type Env = z.infer<typeof EnvSchema>
