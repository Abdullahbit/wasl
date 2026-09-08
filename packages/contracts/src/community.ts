import { z } from 'zod';

export const CommunitySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  languages: z.array(z.string()),
  universities: z.array(z.string()),
  interests: z.array(z.string()),
  location: z.string().nullable(),
  targetAudience: z.string().nullable(),
  joinUrl: z.string().url().nullable(),
  newcomerFriendly: z.boolean(),
  verified: z.boolean(),
  lastReviewed: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CommunityListResponseSchema = z.object({
  data: z.array(CommunitySchema),
  total: z.number(),
});

export type Community = z.infer<typeof CommunitySchema>;
export type CommunityListResponse = z.infer<typeof CommunityListResponseSchema>;
