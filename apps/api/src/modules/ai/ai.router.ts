import { Router, type IRouter } from 'express'
import { requireAuth } from '../../middleware/auth.js'
import { validate } from '../../middleware/validate.js'
import { aiLimiter } from '../../middleware/rate-limit.js'
import { NavigateRequestSchema } from '@platform/contracts'
import * as aiController from './ai.controller.js'

export const aiRouter: IRouter = Router()

aiRouter.use(requireAuth)

aiRouter.post('/navigate', aiLimiter, validate(NavigateRequestSchema), aiController.navigate)
