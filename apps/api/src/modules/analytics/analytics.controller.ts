import type { Request, Response, NextFunction } from 'express'
import * as analyticsService from './analytics.service.js'
import type { TrackEvent } from './analytics.schema.js'

export async function trackEvent(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { eventType, properties } = req.body as TrackEvent
    const userId = req.user?.id ?? null
    // Fire-and-forget: do not await failures blocking the response.
    void analyticsService.trackEvent(userId, eventType, properties)
    res.status(202).json({ data: { accepted: true } })
  } catch (err) {
    next(err)
  }
}
