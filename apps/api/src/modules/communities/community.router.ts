import { Router, type IRouter } from 'express'
import { validate } from '../../middleware/validate.js'
import { CommunityFiltersSchema } from './community.schema.js'
import * as communityController from './community.controller.js'

export const communityRouter: IRouter = Router()

// All community endpoints are public — no auth required
communityRouter.get(
  '/',
  validate(CommunityFiltersSchema, 'query'),
  communityController.listCommunities,
)
communityRouter.get('/slug/:slug', communityController.getCommunityBySlug)
communityRouter.get('/:id', communityController.getCommunityById)
