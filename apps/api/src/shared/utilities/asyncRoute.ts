/**
 * Adapts asynchronous route handlers to Express error middleware.
 */

import type { NextFunction, Request, RequestHandler, Response } from 'express';

type AsyncRequestHandler = (
  request: Request,
  response: Response,
  next: NextFunction,
) => Promise<unknown>;

export function asyncRoute(handler: AsyncRequestHandler): RequestHandler {
  return (request, response, next) => {
    void handler(request, response, next).catch(next);
  };
}
