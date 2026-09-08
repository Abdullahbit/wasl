import type { Request, Response, NextFunction } from 'express'
import * as resourceService from './resource.service.js'
import type { ResourceFilters } from './resource.schema.js'

export async function listResources(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const filters = req.query as unknown as ResourceFilters
    const result = await resourceService.getResources(filters)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export async function getResourceById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = req.params['id']
    if (typeof id !== 'string') {
      throw new Error('Missing id parameter')
    }
    const resource = await resourceService.getResource(id)
    res.json({ data: resource, meta: {} })
  } catch (err) {
    next(err)
  }
}
