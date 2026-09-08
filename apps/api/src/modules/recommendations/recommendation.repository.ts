import { prisma } from '../../db/client.js'

export interface RecommendationEventInput {
  userId: string
  type: string
  entityId: string
  score: number
  algorithm: string
}

export async function recordEvents(events: RecommendationEventInput[]): Promise<void> {
  if (events.length === 0) {
    return
  }
  await prisma.recommendationEvent.createMany({
    data: events.map((event) => ({
      userId: event.userId,
      type: event.type,
      entityId: event.entityId,
      score: event.score,
      algorithm: event.algorithm,
    })),
  })
}
