import type { Request, Response, NextFunction } from 'express'
import * as opportunityService from './opportunity.service.js'
import type { OpportunityFilters } from './opportunity.schema.js'

export async function listOpportunities(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const filters = req.query as unknown as OpportunityFilters
    const result = await opportunityService.getOpportunities(filters)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export async function getOpportunityById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = req.params['id']
    if (typeof id !== 'string') {
      throw new Error('Missing id parameter')
    }
    const opportunity = await opportunityService.getOpportunity(id)
    res.json({ data: opportunity, meta: {} })
  } catch (err) {
    next(err)
  }
}
