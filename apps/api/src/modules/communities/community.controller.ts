import type { Request, Response, NextFunction } from 'express'
import * as communityService from './community.service.js'
import type { CommunityFilters } from './community.schema.js'

export async function listCommunities(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const filters = req.query as unknown as CommunityFilters
    const result = await communityService.getCommunities(filters)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export async function getCommunityById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = req.params['id']
    if (typeof id !== 'string') {
      throw new Error('Missing id parameter')
    }
    const community = await communityService.getCommunity(id)
    res.json({ data: community, meta: {} })
  } catch (err) {
    next(err)
  }
}

export async function getCommunityBySlug(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const slug = req.params['slug']
    if (typeof slug !== 'string') {
      throw new Error('Missing slug parameter')
    }
    const community = await communityService.getCommunityBySlug(slug)
    res.json({ data: community, meta: {} })
  } catch (err) {
    next(err)
  }
}
