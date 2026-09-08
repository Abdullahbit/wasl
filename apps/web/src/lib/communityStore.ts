/**
 * Community Activity & Profile Management Types and Storage
 * Seamlessly stores community-created accounts, profiles, and upcoming/past activities.
 */

export type AccountType = 'STUDENT' | 'COMMUNITY'

export interface CommunityActivity {
  id: string
  communityId: string
  title: string
  description: string
  activityType: string // 'WORKSHOP' | 'MEETUP' | 'CULTURAL' | 'ORIENTATION' | 'NETWORKING'
  date: string
  startTime: string
  endTime?: string
  location: string
  isOnline: boolean
  language: string
  targetAudience: string
  registrationUrl?: string
  capacity?: number
  isNewcomerFriendly: boolean
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED'
  createdAt: string
  updatedAt: string
}

export interface CommunityUserProfile {
  id: string
  userId: string
  communityName: string
  shortDescription: string
  fullDescription: string
  categoryId: string
  categoryName: string
  universityAffiliation?: string
  city: string
  location?: string
  languages: { id: string; name: string; code: string }[]
  targetAudience: string
  interests: { id: string; name: string; slug: string }[]
  contactEmail: string
  websiteUrl?: string
  joinUrl?: string
  logoUrl?: string
  isNewcomerFriendly: boolean
  verificationStatus: 'UNVERIFIED' | 'PENDING' | 'VERIFIED'
  isPublished: boolean
  memberCount: number
  lastReviewedDate?: string
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY_COMMUNITY_PROFILES = 'wasl_community_user_profiles'
const STORAGE_KEY_ACTIVITIES = 'wasl_community_activities'

// Seeded Initial Community Activities for immediate realistic demo
const INITIAL_DEMO_ACTIVITIES: CommunityActivity[] = [
  {
    id: 'act_speaking_club_1',
    communityId: 'com_language_exchange_circle',
    title: 'نادي المحادثة التركية الأسبوعي (TÖMER Conversation Club)',
    description: 'جلسة محادثة تفاعلية مع طلاب وناطقين محليين لتعلم مصطلحات الجامعة والمواقف اليومية في بيئة ودية وداعمة.',
    activityType: 'نادي محادثة وتبادل لغات',
    date: '2026-09-18',
    startTime: '17:30',
    endTime: '19:30',
    location: 'إسطنبول - كاديكوي (مقهى لغات) & بث مباشر عبر Zoom',
    isOnline: false,
    language: 'التركية والعربية',
    targetAudience: 'الطلاب الجدد في السنة التحضيرية والمهتمون بتقوية المحادثة',
    registrationUrl: 'https://languageexchangecircle.example.org/event-reg',
    capacity: 25,
    isNewcomerFriendly: true,
    status: 'PUBLISHED',
    createdAt: '2026-09-08T10:00:00.000Z',
    updatedAt: '2026-09-08T10:00:00.000Z',
  },
  {
    id: 'act_tech_workshop_1',
    communityId: 'com_tech_immigrants_network',
    title: 'ورشة عمل: بناء السيرة الذاتية واقتناص فرص التدريب في شركات التقنية التركية',
    description: 'مراجعة جماعية لمشاريع GitHub والسير الذاتية بالتعاون مع مهندسين برمجيات عرب يعملون في كبرى الشركات التقنية بإسطنبول.',
    activityType: 'ورشة عمل وتطوير مهني',
    date: '2026-09-22',
    startTime: '19:00',
    endTime: '21:00',
    location: 'عبر الإنترنت (Google Meet)',
    isOnline: true,
    language: 'العربية والإنجليزية',
    targetAudience: 'طلاب الهندسة وتكنولوجيا المعلومات والخريجون الجدد',
    registrationUrl: 'https://techimmigrants.example.org/cv-workshop',
    capacity: 100,
    isNewcomerFriendly: true,
    status: 'PUBLISHED',
    createdAt: '2026-09-08T10:00:00.000Z',
    updatedAt: '2026-09-08T10:00:00.000Z',
  },
  {
    id: 'act_legal_clinic_1',
    communityId: 'com_newcomer_legal_network',
    title: 'جلسة استشارية مفتوحة: كل ما تحتاج معرفته عن إقامة الطالب وتجنب نواقص الملف',
    description: 'جلسة إرشادية قانونية يشرف عليها محامون متطوعون للإجابة على استفسارات الطلاب حول حجز موعد الهجرة والأوراق المطلوبة.',
    activityType: 'استشارة قانونية وتوجيه',
    date: '2026-09-25',
    startTime: '16:00',
    endTime: '18:00',
    location: 'إسطنبول - الفاتح (قاعة المركز الثقافي)',
    isOnline: false,
    language: 'العربية والتركية',
    targetAudience: 'الطلاب المقيمون الجدد والقادمون حديثاً لتركيا',
    registrationUrl: 'https://newcomerlegalnetwork.example.org/legal-clinic',
    capacity: 40,
    isNewcomerFriendly: true,
    status: 'PUBLISHED',
    createdAt: '2026-09-08T10:00:00.000Z',
    updatedAt: '2026-09-08T10:00:00.000Z',
  },
]

export const communityStore = {
  // --- Activities ---
  getActivities(communityId?: string): CommunityActivity[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ACTIVITIES)
      let list: CommunityActivity[] = stored ? JSON.parse(stored) : INITIAL_DEMO_ACTIVITIES
      if (communityId) {
        list = list.filter((a) => a.communityId === communityId)
      }
      return list
    } catch {
      return INITIAL_DEMO_ACTIVITIES
    }
  },

  getPublishedActivities(communityId: string): CommunityActivity[] {
    const list = this.getActivities(communityId)
    const today = new Date().toISOString().split('T')[0]
    return list.filter((a) => a.status === 'PUBLISHED' && a.date >= today)
  },

  saveActivity(activity: Omit<CommunityActivity, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): CommunityActivity {
    const list = this.getActivities()
    const now = new Date().toISOString()
    let saved: CommunityActivity

    if (activity.id) {
      const index = list.findIndex((a) => a.id === activity.id)
      saved = {
        ...list[index],
        ...activity,
        updatedAt: now,
      } as CommunityActivity
      if (index !== -1) {
        list[index] = saved
      } else {
        list.unshift(saved)
      }
    } else {
      saved = {
        ...activity,
        id: `act_${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      } as CommunityActivity
      list.unshift(saved)
    }

    try {
      localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(list))
    } catch (e) {
      console.error('Error saving activities to localStorage:', e)
    }
    return saved
  },

  deleteActivity(id: string): void {
    const list = this.getActivities().filter((a) => a.id !== id)
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(list))
    } catch (e) {
      console.error('Error deleting activity:', e)
    }
  },

  // --- Community User Profiles ---
  getCommunityProfile(userId: string): CommunityUserProfile | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_COMMUNITY_PROFILES)
      if (!stored) return null
      const map: Record<string, CommunityUserProfile> = JSON.parse(stored)
      return map[userId] || null
    } catch {
      return null
    }
  },

  getCommunityProfileById(id: string): CommunityUserProfile | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_COMMUNITY_PROFILES)
      if (!stored) return null
      const map: Record<string, CommunityUserProfile> = JSON.parse(stored)
      const found = Object.values(map).find((p) => p.id === id)
      return found || null
    } catch {
      return null
    }
  },

  saveCommunityProfile(profile: CommunityUserProfile): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_COMMUNITY_PROFILES)
      const map: Record<string, CommunityUserProfile> = stored ? JSON.parse(stored) : {}
      map[profile.userId] = {
        ...profile,
        updatedAt: new Date().toISOString(),
      }
      localStorage.setItem(STORAGE_KEY_COMMUNITY_PROFILES, JSON.stringify(map))
    } catch (e) {
      console.error('Error saving community profile:', e)
    }
  },

  getAllCommunityCreated(): CommunityUserProfile[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_COMMUNITY_PROFILES)
      if (!stored) return []
      const map: Record<string, CommunityUserProfile> = JSON.parse(stored)
      return Object.values(map).filter((p) => p.isPublished)
    } catch {
      return []
    }
  },
}
