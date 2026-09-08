import { z } from 'zod'

export const ImmigrationStatus = z.enum([
  'CITIZEN', 'PERMANENT_RESIDENT', 'WORK_VISA', 'STUDENT_VISA',
  'ASYLUM_SEEKER', 'REFUGEE', 'TOURIST', 'OTHER',
])

export const ProfileUpdateSchema = z.object({
  bio: z.string().max(500).optional(),
  originCountry: z.string().min(2).max(100).optional(),
  targetCountry: z.string().min(2).max(100).optional(),
  currentCity: z.string().max(100).optional(),
  languages: z.array(z.string().min(1)).min(1).max(10).optional(),
  interests: z.array(z.string().min(1)).min(1).max(20).optional(),
  goals: z.string().max(1000).optional(),
  immigrationStatus: ImmigrationStatus.optional(),
  visaType: z.string().max(50).optional(),
  arrivalDate: z.string().datetime().optional(),
})

export const ProfileResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  bio: z.string().nullable(),
  originCountry: z.string().nullable(),
  targetCountry: z.string().nullable(),
  currentCity: z.string().nullable(),
  languages: z.array(z.string()),
  interests: z.array(z.string()),
  goals: z.string().nullable(),
  immigrationStatus: ImmigrationStatus.nullable(),
  visaType: z.string().nullable(),
  arrivalDate: z.string().nullable(),
  profileComplete: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type ProfileUpdate = z.infer<typeof ProfileUpdateSchema>
export type ProfileResponse = z.infer<typeof ProfileResponseSchema>
