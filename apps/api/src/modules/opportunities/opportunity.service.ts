import * as opportunityRepo from './opportunity.repository.js'
import type { OpportunityWithRelations } from './opportunity.repository.js'
import { NotFoundError } from '../../shared/errors/AppError.js'
import type { OpportunityFilters } from './opportunity.schema.js'

function serializeOpportunity(
  opportunity: OpportunityWithRelations,
  verificationStatus: string | null,
) {
  return {
    id: opportunity.id,
    title: opportunity.title,
    slug: opportunity.slug,
    description: opportunity.description,
    type: opportunity.type,
    organizationName: opportunity.organizationName,
    applicationUrl: opportunity.applicationUrl,
    deadline: opportunity.deadline ? opportunity.deadline.toISOString() : null,
    isVerified: opportunity.isVerified,
    verificationStatus,
    targetCountry: opportunity.targetCountry,
    requirements: opportunity.requirements,
    interests: opportunity.interests.map((oi) => ({
      id: oi.interest.id,
      name: oi.interest.name,
    })),
    createdAt: opportunity.createdAt.toISOString(),
    updatedAt: opportunity.updatedAt.toISOString(),
  }
}

export async function getOpportunities(filters: OpportunityFilters) {
  const { items, total } = await opportunityRepo.list(filters)
  const records = await opportunityRepo.findVerificationRecords(items.map((o) => o.id))
  const statusByOpportunityId = new Map(records.map((r) => [r.entityId, r.status]))

  const data = items.map((item) =>
    serializeOpportunity(item, statusByOpportunityId.get(item.id) ?? null),
  )

  return {
    data,
    meta: {
      page: filters.page,
      limit: filters.limit,
      total,
      totalPages: Math.ceil(total / filters.limit),
    },
  }
}

export async function getOpportunity(id: string) {
  const opportunity = await opportunityRepo.findById(id)
  if (!opportunity) {
    throw new NotFoundError('Opportunity')
  }
  const record = await opportunityRepo.findVerificationRecord(opportunity.id)
  return serializeOpportunity(opportunity, record?.status ?? null)
}

export async function getCandidatesForProfile(interestIds: string[], targetCountry?: string) {
  const items = await opportunityRepo.findCandidates(interestIds, targetCountry)
  const records = await opportunityRepo.findVerificationRecords(items.map((o) => o.id))
  const statusByOpportunityId = new Map(records.map((r) => [r.entityId, r.status]))
  return items.map((item) =>
    serializeOpportunity(item, statusByOpportunityId.get(item.id) ?? null),
  )
}
