import { Router, type IRouter } from 'express'
import { requireRole } from '../../middleware/auth.js'
import { validate } from '../../middleware/validate.js'
import { VerificationParamsSchema, VerifyEntityBodySchema } from './verification.schema.js'
import * as verificationController from './verification.controller.js'

export const verificationRouter: IRouter = Router()

// Public: anyone can check verification status
verificationRouter.get(
  '/:entityType/:entityId',
  validate(VerificationParamsSchema, 'params'),
  verificationController.getVerificationStatus,
)

// Admin only: verify an entity
verificationRouter.post(
  '/:entityType/:entityId/verify',
  validate(VerificationParamsSchema, 'params'),
  requireRole('admin'),
  validate(VerifyEntityBodySchema, 'body'),
  verificationController.verifyEntity,
)
