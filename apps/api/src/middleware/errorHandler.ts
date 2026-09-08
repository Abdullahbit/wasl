/**
 * Translates expected and unexpected failures into the standard API error shape.
 */

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ErrorResponse } from '@wasl/contracts';
import { logger } from '../config/logger.js';
import { environment } from '../config/env.js';
import { ApplicationError } from '../shared/errors/ApplicationError.js';

export const errorHandler = (
  error: unknown,
  request: Request,
  response: Response,
  _next: NextFunction,
) => {
  if (error instanceof ZodError) {
    const errorResponse: ErrorResponse = {
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: error.issues,
        requestId: String(request.id),
      },
    };
    response.status(400).json(errorResponse);
    return;
  }

  if (error instanceof ApplicationError) {
    response.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        ...(error.details === undefined ? {} : { details: error.details }),
        requestId: String(request.id),
      },
    } satisfies ErrorResponse);
    return;
  }

  logger.error({ error, requestId: request.id }, 'Unhandled request error');

  const errorResponse: ErrorResponse = {
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message:
        environment.NODE_ENV === 'production'
          ? 'An unexpected error occurred.'
          : error instanceof Error
            ? error.message
            : 'An unexpected error occurred.',
      requestId: String(request.id),
    },
  };
  response.status(500).json(errorResponse);
};
