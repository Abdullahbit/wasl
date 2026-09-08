import { createApp } from './app.js'
import { logger } from './config/logger.js'
import { env } from './config/env.js'
import { prisma } from './db/client.js'

async function main() {
  const { app } = createApp()

  const server = app.listen(env.PORT, () => {
    logger.info({ port: env.PORT, env: env.NODE_ENV }, 'Server started')
  })

  const shutdown = async (signal: string) => {
    logger.info({ signal }, 'Shutting down gracefully')
    server.close(async () => {
      await prisma.$disconnect()
      logger.info('Server closed')
      process.exit(0)
    })
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
}

main().catch((err) => {
  logger.error(err, 'Failed to start server')
  process.exit(1)
})
