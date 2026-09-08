import * as profileService from '../profiles/profile.service.js'
import * as communityService from '../communities/community.service.js'
import * as resourceService from '../resources/resource.service.js'
import * as opportunityService from '../opportunities/opportunity.service.js'
import * as recommendationRepo from './recommendation.repository.js'
import { scoreCommunity } from './scoring/community.scorer.js'
import { scoreResource } from './scoring/resource.scorer.js'
import { scoreOpportunity } from './scoring/opportunity.scorer.js'
import { ValidationError } from '../../shared/errors/AppError.js'
import type { ScoringProfile } from './scoring/types.js'

const ALGORITHM = 'deterministic-v1'
const MAX_COMMUNITIES = 5
const MAX_RESOURCES = 5
const MAX_OPPORTUNITIES = 3

// In-memory recommendation cache
const recCache = new Map<string, { data: any; expiresAt: number }>()
const CACHE_TTL_MS = 60_000

export async function getRecommendations(userId: string) {
  const now = Date.now()
  const cached = recCache.get(userId)
  if (cached && cached.expiresAt > now) {
    return cached.data
  }

  const profile = await profileService.getProfile(userId)
  if (!profile || !profile.profileComplete) {
    throw new ValidationError('Profile must be complete before requesting recommendations')
  }

  const scoringProfile: ScoringProfile = {
    languages: profile.languages,
    interests: profile.interests,
    targetCountry: profile.targetCountry,
  }

  const [communityCandidates, resourceCandidates, opportunityCandidates] = await Promise.all([
    communityService.getCandidatesForProfile(profile.interests, profile.languages),
    resourceService.getCandidatesForProfile(profile.interests),
    opportunityService.getCandidatesForProfile(profile.interests, profile.targetCountry ?? undefined),
  ])

  const scoredCommunities = communityCandidates
    .map((community) => ({ ...community, score: scoreCommunity(community, scoringProfile) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_COMMUNITIES)

  const scoredResources = resourceCandidates
    .map((resource) => ({ ...resource, score: scoreResource(resource, scoringProfile) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RESOURCES)

  const scoredOpportunities = opportunityCandidates
    .map((opportunity) => ({ ...opportunity, score: scoreOpportunity(opportunity, scoringProfile) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_OPPORTUNITIES)

  // Fire-and-forget: do not block response on remote DB insertion of recommendation tracking events
  void recommendationRepo
    .recordEvents([
      ...scoredCommunities.map((c) => ({
        userId,
        type: 'COMMUNITY' as const,
        entityId: c.id,
        score: c.score,
        algorithm: ALGORITHM,
      })),
      ...scoredResources.map((r) => ({
        userId,
        type: 'RESOURCE' as const,
        entityId: r.id,
        score: r.score,
        algorithm: ALGORITHM,
      })),
      ...scoredOpportunities.map((o) => ({
        userId,
        type: 'OPPORTUNITY' as const,
        entityId: o.id,
        score: o.score,
        algorithm: ALGORITHM,
      })),
    ])
    .catch((err) => {
      // Non-critical audit event error
      console.error('Failed to record recommendation events:', err)
    })

  const result = {
    data: {
      communities: scoredCommunities,
      resources: scoredResources,
      opportunities: scoredOpportunities,
    },
    meta: {
      generatedAt: new Date().toISOString(),
      algorithm: ALGORITHM,
    },
  }

  recCache.set(userId, { data: result, expiresAt: now + CACHE_TTL_MS })
  return result
}
