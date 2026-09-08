import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../shared/errors/AppError.js'
import { logger } from '../config/logger.js'
import { env } from '../config/env.js'

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error({ requestId: req.requestId, err }, err.message)
    }
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details !== undefined && { details: err.details }),
      },
    })
    return
  }

  logger.error({ requestId: req.requestId, err }, 'Unhandled error')

  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      ...(env.NODE_ENV === 'development' && err instanceof Error && {
        details: { stack: err.stack },
      }),
    },
  })
}
