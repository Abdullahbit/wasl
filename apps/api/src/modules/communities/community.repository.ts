import { prisma } from '../../db/client.js'
import type { Prisma } from '@prisma/client'

export interface CommunityListFilters {
  categoryId?: string | undefined
  languageId?: string | undefined
  interestId?: string | undefined
  search?: string | undefined
  page: number
  limit: number
}

const communityInclude = {
  category: true,
  languages: { include: { language: true } },
  interests: { include: { interest: true } },
} satisfies Prisma.CommunityInclude

export type CommunityWithRelations = Prisma.CommunityGetPayload<{
  include: typeof communityInclude
}>

function buildWhere(filters: {
  categoryId?: string | undefined
  languageId?: string | undefined
  interestId?: string | undefined
  search?: string | undefined
}): Prisma.CommunityWhereInput {
  const where: Prisma.CommunityWhereInput = { isActive: true }

  if (filters.categoryId) {
    where.categoryId = filters.categoryId
  }
  if (filters.languageId) {
    where.languages = { some: { languageId: filters.languageId } }
  }
  if (filters.interestId) {
    where.interests = { some: { interestId: filters.interestId } }
  }
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ]
  }

  return where
}

export async function list(filters: CommunityListFilters): Promise<{
  items: CommunityWithRelations[]
  total: number
}> {
  const where = buildWhere(filters)
  const skip = (filters.page - 1) * filters.limit

  const [items, total] = await Promise.all([
    prisma.community.findMany({
      where,
      include: communityInclude,
      skip,
      take: filters.limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.community.count({ where }),
  ])

  return { items, total }
}

export async function findById(id: string): Promise<CommunityWithRelations | null> {
  return prisma.community.findFirst({
    where: { id, isActive: true },
    include: communityInclude,
  })
}

export async function findBySlug(slug: string): Promise<CommunityWithRelations | null> {
  return prisma.community.findFirst({
    where: { slug, isActive: true },
    include: communityInclude,
  })
}

export async function findVerificationRecord(communityId: string) {
  return prisma.verificationRecord.findFirst({
    where: { entityType: 'COMMUNITY', entityId: communityId },
  })
}

export async function findVerificationRecords(communityIds: string[]) {
  return prisma.verificationRecord.findMany({
    where: { entityType: 'COMMUNITY', entityId: { in: communityIds } },
  })
}

export async function findCandidates(
  profileInterests: string[],
  profileLanguages: string[],
): Promise<CommunityWithRelations[]> {
  if (profileInterests.length === 0 && profileLanguages.length === 0) {
    return []
  }

  const or: Prisma.CommunityWhereInput[] = []
  if (profileInterests.length > 0) {
    or.push({ interests: { some: { interestId: { in: profileInterests } } } })
  }
  if (profileLanguages.length > 0) {
    or.push({ languages: { some: { languageId: { in: profileLanguages } } } })
  }

  return prisma.community.findMany({
    where: {
      isActive: true,
      isVerified: true,
      OR: or,
    },
    include: communityInclude,
  })
}
