/**
 * Sends same-origin JSON requests and validates every server response at runtime.
 */

import { ErrorResponseSchema } from '@wasl/contracts';
import type { ZodType } from 'zod';

export class ApiError extends Error {
  public constructor(
    message: string,
    public readonly code: string,
    public readonly status: number,
    public readonly requestId?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
}

export async function apiRequest<ResponseData>(
  path: string,
  responseSchema: ZodType<ResponseData>,
  options: ApiRequestOptions = {},
): Promise<ResponseData> {
  const response = await fetch(path, {
    method: options.method ?? 'GET',
    credentials: 'include',
    ...(options.body === undefined
      ? {}
      : { headers: { 'content-type': 'application/json' }, body: JSON.stringify(options.body) }),
    ...(options.signal ? { signal: options.signal } : {}),
  });
  const responseBody: unknown = await response.json();

  if (!response.ok) {
    const parsedError = ErrorResponseSchema.safeParse(responseBody);

    if (parsedError.success) {
      const requestId = parsedError.data.error.requestId;
      throw new ApiError(
        parsedError.data.error.message,
        parsedError.data.error.code,
        response.status,
        ...(requestId ? [requestId] : []),
      );
    }

    throw new ApiError('The server returned an unexpected error.', 'UNEXPECTED_RESPONSE', response.status);
  }

  return responseSchema.parse(responseBody);
}
