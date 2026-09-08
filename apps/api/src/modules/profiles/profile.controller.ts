import type { Request, Response, NextFunction } from 'express'
import * as profileService from './profile.service.js'
import { ValidationError } from '../../shared/errors/AppError.js'

export async function getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const profile = await profileService.getProfile(req.user!.id)
    res.json({ data: profile ?? null, meta: {} })
  } catch (err) {
    next(err)
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const profile = await profileService.upsertProfile(req.user!.id, req.body)
    res.json({ data: profile, meta: {} })
  } catch (err) {
    next(err)
  }
}

export async function completeOnboarding(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const profile = await profileService.markOnboardingComplete(req.user!.id)
    res.json({ data: profile, meta: { message: 'Onboarding complete' } })
  } catch (err) {
    if (err instanceof Error && err.message.includes('not complete enough')) {
      next(new ValidationError(err.message))
      return
    }
    next(err)
  }
}
