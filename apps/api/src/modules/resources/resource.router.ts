import { Router, type IRouter } from 'express'
import { validate } from '../../middleware/validate.js'
import { ResourceFiltersSchema } from './resource.schema.js'
import * as resourceController from './resource.controller.js'

export const resourceRouter: IRouter = Router()

// All resource endpoints are public — no auth required
resourceRouter.get(
  '/',
  validate(ResourceFiltersSchema, 'query'),
  resourceController.listResources,
)
resourceRouter.get('/:id', resourceController.getResourceById)
