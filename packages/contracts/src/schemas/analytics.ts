import { z } from 'zod'

export const AnalyticsEventType = z.enum([
  'ONBOARDING_COMPLETE',
  'RECOMMENDATION_GENERATED',
  'COMMUNITY_VIEW',
  'RESOURCE_VIEW',
  'OPPORTUNITY_VIEW',
  'AI_NAVIGATE',
])

export const TrackEventSchema = z.object({
  eventType: AnalyticsEventType,
  properties: z.record(z.unknown()).default({}),
})

export type TrackEvent = z.infer<typeof TrackEventSchema>
