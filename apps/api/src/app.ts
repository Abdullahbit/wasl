import express, { type Express, type Router } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { pinoHttp } from 'pino-http'
import { requestId } from './middleware/request-id.js'
import { errorHandler } from './middleware/error-handler.js'
import { generalLimiter } from './middleware/rate-limit.js'
import { logger } from './config/logger.js'
import { env } from './config/env.js'
import { NotFoundError } from './shared/errors/AppError.js'
import { authRouter } from './modules/auth/auth.router.js'

export function createApp(): { app: Express; v1Router: Router } {
  const app = express()

  // Security
  app.use(helmet())
  app.use(cors({
    origin: env.CORS_ORIGIN ?? 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }))

  // Body parsing
  app.use(express.json({ limit: '100kb' }))
  app.use(express.urlencoded({ extended: true, limit: '100kb' }))

  // Request ID
  app.use(requestId)

  // HTTP logging (never logs authorization headers or cookies — redacted by pino config)
  app.use(pinoHttp({
    logger,
    customProps: (req) => ({
      requestId: (req as express.Request).requestId,
    }),
    redact: ['req.headers.authorization', 'req.headers.cookie'],
  }))

  // Rate limit general API
  app.use('/api/v1', generalLimiter)

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  // Auth routes (Better Auth handles all auth HTTP)
  app.use('/api/auth', authRouter)

  // API v1 router placeholder — modules mount here in later tasks
  const v1Router = express.Router()
  app.use('/api/v1', v1Router)

  // 404 handler
  app.use((_req, _res, next) => {
    next(new NotFoundError('Route'))
  })

  // Centralized error handler
  app.use(errorHandler)

  return { app, v1Router }
}
