import type { Request, Response, NextFunction } from 'express'
import * as recommendationService from './recommendation.service.js'
import { UnauthorizedError } from '../../shared/errors/AppError.js'

export async function getRecommendations(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError()
    }
    const result = await recommendationService.getRecommendations(req.user.id)
    res.json(result)
  } catch (err) {
    next(err)
  }
}
