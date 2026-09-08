import type { Request, Response, NextFunction } from 'express'
import { auth } from '../modules/auth/auth.service.js'
import { UnauthorizedError, ForbiddenError } from '../shared/errors/AppError.js'
import { fromNodeHeaders } from 'better-auth/node'

export async function requireAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    })
    if (!session?.user) {
      next(new UnauthorizedError())
      return
    }
    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: (session.user as { role?: string }).role ?? 'user',
    }
    next()
  } catch {
    next(new UnauthorizedError())
  }
}

export function requireRole(role: string) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await requireAuth(req, res, async (err?: unknown) => {
      if (err) { next(err); return }
      if (!req.user) { next(new UnauthorizedError()); return }
      if (req.user.role !== role && req.user.role !== 'admin') {
        next(new ForbiddenError())
        return
      }
      next()
    })
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
