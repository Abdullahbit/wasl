import { prisma } from '../../db/client.js'
import type { VerificationRecord } from '@prisma/client'

export async function findByEntity(
  entityType: string,
  entityId: string,
): Promise<VerificationRecord | null> {
  return prisma.verificationRecord.findFirst({
    where: { entityType, entityId },
  })
}

export async function upsertVerified(
  entityType: string,
  entityId: string,
  verifiedBy: string,
  notes: string | undefined,
): Promise<VerificationRecord> {
  const now = new Date()
  return prisma.verificationRecord.upsert({
    where: { entityId },
    create: {
      entityType,
      entityId,
      status: 'VERIFIED',
      verifiedAt: now,
      verifiedBy,
      notes: notes ?? null,
    },
    update: {
      entityType,
      status: 'VERIFIED',
      verifiedAt: now,
      verifiedBy,
      notes: notes ?? null,
    },
  })
}
