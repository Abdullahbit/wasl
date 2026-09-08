/**
 * Exposes the single Prisma Client used by all server repositories.
 */

import { PrismaClient } from '@prisma/client';
import { environment } from '../config/env.js';

const globalPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalPrisma.prisma ?? new PrismaClient();

if (environment.NODE_ENV !== 'production') {
  globalPrisma.prisma = prisma;
}
