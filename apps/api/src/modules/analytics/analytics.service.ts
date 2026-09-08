import * as analyticsRepo from './analytics.repository.js'
import { logger } from '../../config/logger.js'
import type { Prisma } from '@prisma/client'

/**
 * Records an analytics event. Fire-and-forget: never throws, never blocks
 * the caller. Errors are logged, not propagated.
 *
 * Never log personal content in event properties — callers must ensure
 * `properties` contains only non-identifying, aggregate-friendly data.
 */
export async function trackEvent(
  userId: string | null,
  eventType: string,
  properties: Record<string, unknown>,
): Promise<void> {
  try {
    await analyticsRepo.create({
      userId,
      eventType,
      properties: properties as Prisma.InputJsonValue,
    })
  } catch (err) {
    logger.error({ err, eventType }, 'Failed to record analytics event')
  }
}
