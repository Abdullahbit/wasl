/**
 * Provides structured logging shared by request middleware and server modules.
 */

import pino from 'pino';
import { environment } from './env.js';

export const logger = pino({
  level: environment.NODE_ENV === 'development' ? 'debug' : 'info',
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'password',
      '*.password',
      '*.token',
    ],
    censor: '[REDACTED]',
  },
});
