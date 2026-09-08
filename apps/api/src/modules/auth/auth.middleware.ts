/**
 * Resolves Better Auth sessions and protects routes using server-side identity.
 */

import type { NextFunction, Request, Response } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from './auth.js';

export async function requireAuthenticatedUser(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(request.headers) });

    if (!session) {
      response.status(401).json({
        error: {
          code: 'UNAUTHENTICATED',
          message: 'Sign in to continue.',
          requestId: request.id,
        },
      });
      return;
    }

    response.locals.session = session;
    next();
  } catch (error) {
    next(error);
  }
}
