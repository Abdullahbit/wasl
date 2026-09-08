import type { Request, Response, NextFunction } from 'express'
import { UnauthorizedError, ForbiddenError } from '../shared/errors/AppError.js'

// Will be wired to Better Auth in Task 4
// Placeholder that modules can import without circular deps

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) {
    next(new UnauthorizedError())
    return
  }
  next()
}

export function requireRole(role: string) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError())
      return
    }
    if (req.user.role !== role && req.user.role !== 'admin') {
      next(new ForbiddenError())
      return
    }
    next()
  }
}

// Augment Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        role: string
        name: string
      }
    }
  }
}
