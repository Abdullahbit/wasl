import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ErrorResponse } from '@wasl/contracts';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof ZodError) {
    const errorResponse: ErrorResponse = {
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: err.errors,
      }
    };
    return res.status(400).json(errorResponse);
  }

  const errorResponse: ErrorResponse = {
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred',
    }
  };
  return res.status(500).json(errorResponse);
};
