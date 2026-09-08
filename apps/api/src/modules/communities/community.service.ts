import * as communityRepo from './community.repository.js'
import type { CommunityWithRelations } from './community.repository.js'
import { NotFoundError } from '../../shared/errors/AppError.js'
import type { CommunityFilters } from './community.schema.js'

function serializeCommunity(
  community: CommunityWithRelations,
  verificationStatus: string | null,
) {
  return {
    id: community.id,
    name: community.name,
    slug: community.slug,
    description: community.description,
    websiteUrl: community.websiteUrl,
    contactEmail: community.contactEmail,
    joinUrl: community.joinUrl,
    memberCount: community.memberCount,
    isVerified: community.isVerified,
    verificationStatus,
    category: community.category
      ? { id: community.category.id, name: community.category.name, slug: community.category.slug }
      : null,
    languages: community.languages.map((cl) => ({
      id: cl.language.id,
      code: cl.language.code,
      name: cl.language.name,
    })),
    interests: community.interests.map((ci) => ({
      id: ci.interest.id,
      name: ci.interest.name,
      slug: ci.interest.slug,
    })),
    createdAt: community.createdAt.toISOString(),
    updatedAt: community.updatedAt.toISOString(),
  }
}

// Fast in-memory cache to eliminate round-trip latency to remote pooler
const cache = new Map<string, { data: any; expiry: number }>()
const CACHE_TTL_MS = 60_000 // 60 seconds

export async function getCommunities(filters: CommunityFilters) {
  const cacheKey = JSON.stringify(filters)
  const cached = cache.get(cacheKey)
  if (cached && cached.expiry > Date.now()) {
    return cached.data
  }

  const { items, total } = await communityRepo.list(filters)
  const records = await communityRepo.findVerificationRecords(items.map((c) => c.id))
  const statusByCommunityId = new Map(records.map((r) => [r.entityId, r.status]))

  const data = items.map((item) =>
    serializeCommunity(item, statusByCommunityId.get(item.id) ?? null),
  )

  const result = {
    data,
    meta: {
      page: filters.page,
      limit: filters.limit,
      total,
      totalPages: Math.ceil(total / filters.limit),
    },
  }

  cache.set(cacheKey, { data: result, expiry: Date.now() + CACHE_TTL_MS })
  return result
}

export async function getCommunity(id: string) {
  const cacheKey = `comm_${id}`
  const cached = cache.get(cacheKey)
  if (cached && cached.expiry > Date.now()) {
    return cached.data
  }

  const community = await communityRepo.findById(id)
  if (!community) {
    throw new NotFoundError('Community')
  }
  const record = await communityRepo.findVerificationRecord(community.id)
  const result = serializeCommunity(community, record?.status ?? null)

  cache.set(cacheKey, { data: result, expiry: Date.now() + CACHE_TTL_MS })
  return result
}

export async function getCommunityBySlug(slug: string) {
  const community = await communityRepo.findBySlug(slug)
  if (!community) {
    throw new NotFoundError('Community')
  }
  const record = await communityRepo.findVerificationRecord(community.id)
  return serializeCommunity(community, record?.status ?? null)
}

export async function getCandidatesForProfile(
  profileInterests: string[],
  profileLanguages: string[],
) {
  const items = await communityRepo.findCandidates(profileInterests, profileLanguages)
  const records = await communityRepo.findVerificationRecords(items.map((c) => c.id))
  const statusByCommunityId = new Map(records.map((r) => [r.entityId, r.status]))
  return items.map((item) => serializeCommunity(item, statusByCommunityId.get(item.id) ?? null))
}
