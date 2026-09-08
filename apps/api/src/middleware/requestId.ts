/**
 * Preserves a safe caller request ID or creates one for end-to-end tracing.
 */

import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

const MAXIMUM_REQUEST_ID_LENGTH = 128;

export function requestId(request: Request, response: Response, next: NextFunction) {
  const providedRequestId = request.header('x-request-id');
  const isProvidedRequestIdSafe =
    providedRequestId !== undefined && providedRequestId.length <= MAXIMUM_REQUEST_ID_LENGTH;

  request.id = isProvidedRequestIdSafe ? providedRequestId : randomUUID();
  response.setHeader('x-request-id', request.id);
  next();
}
