import { Router, type IRouter } from 'express'
import { toNodeHandler } from 'better-auth/node'
import { auth } from './auth.service.js'
import { authLimiter } from '../../middleware/rate-limit.js'

export const authRouter: IRouter = Router()

// Apply rate limiting to sensitive auth endpoints
authRouter.use('/sign-in/{*path}', authLimiter)
authRouter.use('/sign-up/{*path}', authLimiter)
authRouter.use('/forgot-password', authLimiter)
authRouter.use('/reset-password', authLimiter)
authRouter.use('/send-verification-email', authLimiter)

// Better Auth handles ALL auth HTTP via its node handler
authRouter.all('/{*path}', toNodeHandler(auth))
