/**
 * Starts the HTTP server and closes infrastructure cleanly during shutdown.
 */

import { app } from './app.js';
import { environment } from './config/env.js';
import { logger } from './config/logger.js';
import { prisma } from './db/prisma.js';

const server = app.listen(environment.PORT, () => {
  logger.info({ port: environment.PORT }, 'WASL API is listening');
});

async function shutdown(signal: string) {
  logger.info({ signal }, 'Shutting down WASL API');
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
