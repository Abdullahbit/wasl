/**
 * Returns the standard error envelope for unmatched API routes.
 */

import type { Request, Response } from 'express';

export function notFound(request: Request, response: Response) {
  response.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'The requested endpoint does not exist.',
      requestId: request.id,
    },
  });
}
