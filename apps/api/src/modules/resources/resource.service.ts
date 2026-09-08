import * as resourceRepo from './resource.repository.js'
import type { ResourceWithRelations } from './resource.repository.js'
import { NotFoundError } from '../../shared/errors/AppError.js'
import type { ResourceFilters } from './resource.schema.js'

function serializeResource(
  resource: ResourceWithRelations,
  verificationStatus: string | null,
) {
  return {
    id: resource.id,
    title: resource.title,
    slug: resource.slug,
    description: resource.description,
    url: resource.url,
    type: resource.type,
    isVerified: resource.isVerified,
    verificationStatus,
    category: resource.category
      ? { id: resource.category.id, name: resource.category.name }
      : null,
    interests: resource.interests.map((ri) => ({
      id: ri.interest.id,
      name: ri.interest.name,
    })),
    createdAt: resource.createdAt.toISOString(),
    updatedAt: resource.updatedAt.toISOString(),
  }
}

export async function getResources(filters: ResourceFilters) {
  const { items, total } = await resourceRepo.list(filters)
  const records = await resourceRepo.findVerificationRecords(items.map((r) => r.id))
  const statusByResourceId = new Map(records.map((r) => [r.entityId, r.status]))

  const data = items.map((item) =>
    serializeResource(item, statusByResourceId.get(item.id) ?? null),
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

export async function getResource(id: string) {
  const resource = await resourceRepo.findById(id)
  if (!resource) {
    throw new NotFoundError('Resource')
  }
  const record = await resourceRepo.findVerificationRecord(resource.id)
  return serializeResource(resource, record?.status ?? null)
}

export async function getCandidatesForProfile(interestIds: string[]) {
  const items = await resourceRepo.findCandidates(interestIds)
  const records = await resourceRepo.findVerificationRecords(items.map((r) => r.id))
  const statusByResourceId = new Map(records.map((r) => [r.entityId, r.status]))
  return items.map((item) => serializeResource(item, statusByResourceId.get(item.id) ?? null))
}
