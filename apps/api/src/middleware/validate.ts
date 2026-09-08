import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { ValidationError } from '../shared/errors/AppError.js'

type Target = 'body' | 'query' | 'params'

export function validate<T extends z.ZodTypeAny>(
  schema: T,
  target: Target = 'body',
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target])
    if (!result.success) {
      next(new ValidationError('Validation failed', result.error.flatten()))
      return
    }
    if (target === 'query') {
      // Express 5's req.query is a getter with no setter — mutate in place instead of reassigning.
      Object.defineProperty(req, 'query', {
        value: result.data,
        writable: true,
        enumerable: true,
        configurable: true,
      })
    } else {
      req[target] = result.data
    }
    next()
  }
}
