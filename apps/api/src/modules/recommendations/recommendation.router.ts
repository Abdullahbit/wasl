import { Router, type IRouter } from 'express'
import { requireAuth } from '../../middleware/auth.js'
import * as recommendationController from './recommendation.controller.js'

export const recommendationRouter: IRouter = Router()

recommendationRouter.use(requireAuth)

recommendationRouter.get('/', recommendationController.getRecommendations)
