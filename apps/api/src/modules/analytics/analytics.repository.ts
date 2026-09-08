import { prisma } from '../../db/client.js'
import type { Prisma } from '@prisma/client'

export async function create(data: {
  userId: string | null
  eventType: string
  properties: Prisma.InputJsonValue
}): Promise<void> {
  await prisma.analyticsEvent.create({
    data: {
      userId: data.userId,
      eventType: data.eventType,
      properties: data.properties,
    },
  })
}
