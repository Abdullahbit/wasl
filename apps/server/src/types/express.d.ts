/**
 * Adds request IDs to Express request typing for consistent tracing and errors.
 */

declare global {
  namespace Express {
    interface Request {
      id: string;
    }
  }
}

export {};
