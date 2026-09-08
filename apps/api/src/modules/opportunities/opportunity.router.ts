import { Router, type IRouter } from 'express'
import { validate } from '../../middleware/validate.js'
import { OpportunityFiltersSchema } from './opportunity.schema.js'
import * as opportunityController from './opportunity.controller.js'

export const opportunityRouter: IRouter = Router()

// All opportunity endpoints are public — no auth required
opportunityRouter.get(
  '/',
  validate(OpportunityFiltersSchema, 'query'),
  opportunityController.listOpportunities,
)
opportunityRouter.get('/:id', opportunityController.getOpportunityById)
