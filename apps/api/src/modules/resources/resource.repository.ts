import { prisma } from '../../db/client.js'
import type { Prisma } from '@prisma/client'

export interface ResourceListFilters {
  categoryId?: string | undefined
  interestId?: string | undefined
  type?: string | undefined
  search?: string | undefined
  page: number
  limit: number
}

const resourceInclude = {
  category: true,
  interests: { include: { interest: true } },
} satisfies Prisma.ResourceInclude

export type ResourceWithRelations = Prisma.ResourceGetPayload<{
  include: typeof resourceInclude
}>

function buildWhere(filters: {
  categoryId?: string | undefined
  interestId?: string | undefined
  type?: string | undefined
  search?: string | undefined
}): Prisma.ResourceWhereInput {
  const where: Prisma.ResourceWhereInput = { isActive: true }

  if (filters.categoryId) {
    where.categoryId = filters.categoryId
  }
  if (filters.type) {
    where.type = filters.type
  }
  if (filters.interestId) {
    where.interests = { some: { interestId: filters.interestId } }
  }
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ]
  }

  return where
}

export async function list(filters: ResourceListFilters): Promise<{
  items: ResourceWithRelations[]
  total: number
}> {
  const where = buildWhere(filters)
  const skip = (filters.page - 1) * filters.limit

  const [items, total] = await Promise.all([
    prisma.resource.findMany({
      where,
      include: resourceInclude,
      skip,
      take: filters.limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.resource.count({ where }),
  ])

  return { items, total }
}

export async function findById(id: string): Promise<ResourceWithRelations | null> {
  return prisma.resource.findFirst({
    where: { id, isActive: true },
    include: resourceInclude,
  })
}

export async function findVerificationRecord(resourceId: string) {
  return prisma.verificationRecord.findFirst({
    where: { entityType: 'RESOURCE', entityId: resourceId },
  })
}

export async function findVerificationRecords(resourceIds: string[]) {
  return prisma.verificationRecord.findMany({
    where: { entityType: 'RESOURCE', entityId: { in: resourceIds } },
  })
}

export async function findCandidates(interestIds: string[]): Promise<ResourceWithRelations[]> {
  if (interestIds.length === 0) {
    return []
  }

  return prisma.resource.findMany({
    where: {
      isActive: true,
      isVerified: true,
      interests: { some: { interestId: { in: interestIds } } },
    },
    include: resourceInclude,
  })
}
