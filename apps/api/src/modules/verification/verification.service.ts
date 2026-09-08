import * as verificationRepo from './verification.repository.js'
import type { VerificationRecord } from '@prisma/client'

export async function getVerificationStatus(
  entityType: string,
  entityId: string,
): Promise<VerificationRecord | null> {
  return verificationRepo.findByEntity(entityType, entityId)
}

export async function verifyEntity(
  entityType: string,
  entityId: string,
  verifiedBy: string,
  notes: string | undefined,
): Promise<VerificationRecord> {
  return verificationRepo.upsertVerified(entityType, entityId, verifiedBy, notes)
}
