import { prisma } from '../../db/client.js'
import type { Prisma } from '@prisma/client'

export interface OpportunityListFilters {
  type?: string | undefined
  interestId?: string | undefined
  targetCountry?: string | undefined
  search?: string | undefined
  page: number
  limit: number
}

const opportunityInclude = {
  interests: { include: { interest: true } },
} satisfies Prisma.OpportunityInclude

export type OpportunityWithRelations = Prisma.OpportunityGetPayload<{
  include: typeof opportunityInclude
}>

function buildWhere(filters: {
  type?: string | undefined
  interestId?: string | undefined
  targetCountry?: string | undefined
  search?: string | undefined
}): Prisma.OpportunityWhereInput {
  const where: Prisma.OpportunityWhereInput = { isActive: true }

  if (filters.type) {
    where.type = filters.type
  }
  if (filters.targetCountry) {
    where.targetCountry = filters.targetCountry
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

export async function list(filters: OpportunityListFilters): Promise<{
  items: OpportunityWithRelations[]
  total: number
}> {
  const where = buildWhere(filters)
  const skip = (filters.page - 1) * filters.limit

  const [items, total] = await Promise.all([
    prisma.opportunity.findMany({
      where,
      include: opportunityInclude,
      skip,
      take: filters.limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.opportunity.count({ where }),
  ])

  return { items, total }
}

export async function findById(id: string): Promise<OpportunityWithRelations | null> {
  return prisma.opportunity.findFirst({
    where: { id, isActive: true },
    include: opportunityInclude,
  })
}

export async function findVerificationRecord(opportunityId: string) {
  return prisma.verificationRecord.findFirst({
    where: { entityType: 'OPPORTUNITY', entityId: opportunityId },
  })
}

export async function findVerificationRecords(opportunityIds: string[]) {
  return prisma.verificationRecord.findMany({
    where: { entityType: 'OPPORTUNITY', entityId: { in: opportunityIds } },
  })
}

export async function findCandidates(
  interestIds: string[],
  targetCountry?: string,
): Promise<OpportunityWithRelations[]> {
  if (interestIds.length === 0) {
    return []
  }

  const where: Prisma.OpportunityWhereInput = {
    isActive: true,
    isVerified: true,
    interests: { some: { interestId: { in: interestIds } } },
  }
  if (targetCountry) {
    where.targetCountry = targetCountry
  }

  return prisma.opportunity.findMany({
    where,
    include: opportunityInclude,
  })
}
