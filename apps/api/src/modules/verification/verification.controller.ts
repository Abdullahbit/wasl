import type { Request, Response, NextFunction } from 'express'
import * as verificationService from './verification.service.js'
import { UnauthorizedError } from '../../shared/errors/AppError.js'
import type { VerificationParams, VerifyEntityBody } from './verification.schema.js'

function serialize(record: {
  id: string
  entityType: string
  entityId: string
  status: string
  verifiedAt: Date | null
  verifiedBy: string | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
}) {
  return {
    id: record.id,
    entityType: record.entityType,
    entityId: record.entityId,
    status: record.status,
    verifiedAt: record.verifiedAt ? record.verifiedAt.toISOString() : null,
    verifiedBy: record.verifiedBy,
    notes: record.notes,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  }
}

export async function getVerificationStatus(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { entityType, entityId } = req.params as unknown as VerificationParams
    const record = await verificationService.getVerificationStatus(entityType, entityId)
    res.json({
      data: record
        ? serialize(record)
        : { entityType, entityId, status: 'UNVERIFIED' },
    })
  } catch (err) {
    next(err)
  }
}

export async function verifyEntity(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { entityType, entityId } = req.params as unknown as VerificationParams
    const { notes } = req.body as VerifyEntityBody
    if (!req.user) {
      throw new UnauthorizedError()
    }
    const record = await verificationService.verifyEntity(
      entityType,
      entityId,
      req.user.id,
      notes,
    )
    res.json({ data: serialize(record) })
  } catch (err) {
    next(err)
  }
}
