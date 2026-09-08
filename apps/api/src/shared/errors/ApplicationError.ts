/**
 * Represents expected failures that can safely be translated into API errors.
 */

export class ApplicationError extends Error {
  public constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApplicationError';
  }
}
