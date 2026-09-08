/**
 * Defines conservative in-memory limits for abuse-prone MVP endpoints.
 */

import { rateLimit } from 'express-rate-limit';

export const authenticationRateLimit = rateLimit({
  windowMs: 15 * 60 * 1_000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

export const aiRateLimit = rateLimit({
  windowMs: 60 * 1_000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});
