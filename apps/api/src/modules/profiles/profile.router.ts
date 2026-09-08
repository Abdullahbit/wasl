import { Router, type IRouter } from 'express'
import { requireAuth } from '../../middleware/auth.js'
import { validate } from '../../middleware/validate.js'
import { ProfileUpdateSchema } from './profile.schema.js'
import * as profileController from './profile.controller.js'

export const profileRouter: IRouter = Router()

profileRouter.use(requireAuth)

profileRouter.get('/', profileController.getProfile)
profileRouter.put('/', validate(ProfileUpdateSchema), profileController.updateProfile)
profileRouter.post('/complete', profileController.completeOnboarding)
