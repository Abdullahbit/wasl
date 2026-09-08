import type { Request, Response, NextFunction } from 'express'
import * as aiService from './ai.service.js'
import { UnauthorizedError } from '../../shared/errors/AppError.js'
import type { NavigateRequest } from '@platform/contracts'

export async function navigate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new UnauthorizedError()
    }
    const { query } = req.body as NavigateRequest
    const result = await aiService.navigate(req.user.id, query)
    res.json({
      data: {
        explanation: result.explanation,
        navigationAdvice: result.navigationAdvice,
        communities: result.communities,
        resources: result.resources,
        opportunities: result.opportunities,
      },
      meta: {
        aiAvailable: result.aiAvailable,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (err) {
    next(err)
  }
}
