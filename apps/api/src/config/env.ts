/**
 * Loads and validates server-only configuration before the application starts.
 */

import dotenv from 'dotenv';
import { resolve } from 'node:path';
import { z } from 'zod';

dotenv.config({ path: resolve(process.cwd(), '../../.env') });
dotenv.config();

const OptionalSecretSchema = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.string().min(1).optional(),
);

const EnvironmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().max(65_535).default(3000),
  APP_URL: z.string().url().default('http://localhost:5173'),
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(32),
  RESEND_API_KEY: OptionalSecretSchema,
  EMAIL_FROM: z.string().min(3).default('WASL <onboarding@resend.dev>'),
  AI_PROVIDER_API_KEY: OptionalSecretSchema,
});

const environmentResult = EnvironmentSchema.safeParse(process.env);

if (!environmentResult.success) {
  const formattedErrors = environmentResult.error.flatten().fieldErrors;
  throw new Error(`Invalid server environment: ${JSON.stringify(formattedErrors)}`);
}

export const environment = environmentResult.data;
