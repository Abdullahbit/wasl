/**
 * Validates and normalizes incoming request data at HTTP boundaries.
 */

import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';

export const validateRequest = (schema: ZodType) => {
  return async (request: Request, _response: Response, next: NextFunction) => {
    try {
      request.body = await schema.parseAsync(request.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateQuery = (schema: ZodType) => {
  return async (request: Request, _response: Response, next: NextFunction) => {
    try {
      const query = await schema.parseAsync(request.query);
      Object.assign(request.query, query);
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateParams = (schema: ZodType) => {
  return async (request: Request, _response: Response, next: NextFunction) => {
    try {
      request.params = (await schema.parseAsync(request.params)) as Request['params'];
      next();
    } catch (error) {
      next(error);
    }
  };
};
