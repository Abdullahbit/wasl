import { Router, type IRouter } from 'express'
import { requireAuth } from '../../middleware/auth.js'
import { validate } from '../../middleware/validate.js'
import { TrackEventSchema } from './analytics.schema.js'
import * as analyticsController from './analytics.controller.js'

export const analyticsRouter: IRouter = Router()

analyticsRouter.post(
  '/track',
  requireAuth,
  validate(TrackEventSchema, 'body'),
  analyticsController.trackEvent,
)
