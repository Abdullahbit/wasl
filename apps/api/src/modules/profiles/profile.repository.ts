import { prisma } from '../../db/client.js'
import type { Prisma } from '@prisma/client'

export async function findProfileByUserId(userId: string) {
  return prisma.profile.findUnique({ where: { userId } })
}

export async function upsertProfile(userId: string, data: Prisma.ProfileUpdateInput) {
  // Use unchecked create to avoid userId/user relation conflict
  const createData: Prisma.ProfileUncheckedCreateInput = {
    userId,
    ...(data as unknown as Omit<Prisma.ProfileUncheckedCreateInput, 'userId'>),
  }
  return prisma.profile.upsert({
    where: { userId },
    create: createData,
    update: data,
  })
}

export async function markProfileComplete(userId: string) {
  return prisma.profile.update({
    where: { userId },
    data: { profileComplete: true },
  })
}
