/**
 * Typed API client for Wasl (وصل) frontend connecting to the backend endpoints.
 */

export interface ApiCategory {
  id: string
  name: string
  slug: string
  description?: string | null
}

export interface ApiLanguage {
  id: string
  code: string
  name: string
}

export interface ApiInterest {
  id: string
  name: string
  slug: string
}

export interface ApiCommunity {
  id: string
  name: string
  slug: string
  description: string
  websiteUrl: string | null
  contactEmail: string | null
  joinUrl: string | null
  memberCount: number | null
  isVerified: boolean
  verificationStatus: string | null
  category: ApiCategory | null
  languages: ApiLanguage[]
  interests: ApiInterest[]
  createdAt: string
  updatedAt: string
}

export interface ApiResource {
  id: string
  title: string
  slug: string
  description: string
  url: string
  type: string
  isVerified: boolean
  category: { id: string; name: string } | null
  interests: { id: string; name: string }[]
}

export interface ApiOpportunity {
  id: string
  title: string
  slug: string
  description: string
  type: string
  organizationName: string
  applicationUrl: string | null
  deadline: string | null
  isVerified: boolean
  targetCountry: string | null
  requirements: string | null
  interests: { id: string; name: string }[]
}

export interface ApiUser {
  id: string
  email: string
  name: string
  role: string
  emailVerified: boolean
}

export interface ApiProfile {
  id: string
  userId: string
  bio: string | null
  originCountry: string | null
  targetCountry: string | null
  currentCity: string | null
  languages: string[]
  interests: string[]
  goals: string | null
  immigrationStatus: string | null
  visaType: string | null
  arrivalDate: string | null
  profileComplete: boolean
  createdAt: string
  updatedAt: string
}

export interface ScoredCommunity extends ApiCommunity {
  score: number
}

export interface ScoredResource extends ApiResource {
  score: number
}

export interface ScoredOpportunity extends ApiOpportunity {
  score: number
}

export interface RecommendationData {
  communities: ScoredCommunity[]
  resources: ScoredResource[]
  opportunities: ScoredOpportunity[]
}

export interface CommunityFilters {
  categoryId?: string
  languageId?: string
  interestId?: string
  search?: string
  page?: number
  limit?: number
}

export interface PaginatedResult<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const API_BASE = typeof window !== 'undefined' && window.location.port === '5173'
  ? 'http://localhost:3000/api'
  : '/api'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {})
  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include', // sends and receives Better-Auth session cookies
  })

  if (!response.ok) {
    let errorMessage = `HTTP error ${response.status}`
    try {
      const errJson = await response.json()
      if (errJson.error?.message) {
        errorMessage = errJson.error.message
      } else if (errJson.message) {
        errorMessage = errJson.message
      }
    } catch {
      // no json body
    }
    const error = new Error(errorMessage)
    ;(error as unknown as { status: number }).status = response.status
    throw error
  }

  return response.json()
}

// ─── AUTH APIS ─────────────────────────────────────────────────────────────

export const authApi = {
  async signIn(email: string, password: string) {
    return request<{ user: ApiUser; token?: string }>('/auth/sign-in/email', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  async signUp(name: string, email: string, password: string) {
    return request<{ user: ApiUser; token?: string }>('/auth/sign-up/email', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    })
  },

  async signOut() {
    return request<{ success: boolean }>('/auth/sign-out', {
      method: 'POST',
    })
  },

  async getSession(): Promise<{ user: ApiUser | null }> {
    try {
      const res = await request<{ user: ApiUser }>('/auth/get-session')
      return { user: res?.user ?? null }
    } catch {
      return { user: null }
    }
  },
}

// ─── PROFILE APIS ──────────────────────────────────────────────────────────

export const profileApi = {
  async get(): Promise<ApiProfile | null> {
    const res = await request<{ data: ApiProfile | null }>('/v1/profile')
    return res.data
  },

  async update(data: Partial<Omit<ApiProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'profileComplete'>>): Promise<ApiProfile> {
    const res = await request<{ data: ApiProfile }>('/v1/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return res.data
  },

  async complete(): Promise<ApiProfile> {
    const res = await request<{ data: ApiProfile; meta: { message: string } }>('/v1/profile/complete', {
      method: 'POST',
    })
    return res.data
  },
}

// ─── COMMUNITIES APIS ──────────────────────────────────────────────────────

export const communitiesApi = {
  async list(filters: CommunityFilters = {}): Promise<PaginatedResult<ApiCommunity>> {
    const query = new URLSearchParams()
    if (filters.categoryId) query.set('categoryId', filters.categoryId)
    if (filters.languageId) query.set('languageId', filters.languageId)
    if (filters.interestId) query.set('interestId', filters.interestId)
    if (filters.search) query.set('search', filters.search)
    if (filters.page) query.set('page', String(filters.page))
    if (filters.limit) query.set('limit', String(filters.limit))

    const queryString = query.toString() ? `?${query.toString()}` : ''
    return request<PaginatedResult<ApiCommunity>>(`/v1/communities${queryString}`)
  },

  async getById(id: string): Promise<ApiCommunity> {
    const res = await request<{ data: ApiCommunity }>(`/v1/communities/${id}`)
    return res.data
  },

  async getBySlug(slug: string): Promise<ApiCommunity> {
    const res = await request<{ data: ApiCommunity }>(`/v1/communities/slug/${slug}`)
    return res.data
  },
}

// ─── RECOMMENDATIONS APIS ──────────────────────────────────────────────────

export const recommendationsApi = {
  async get(): Promise<RecommendationData> {
    const res = await request<{ data: RecommendationData }>('/v1/recommendations')
    return res.data
  },
}

// ─── RESOURCES & OPPORTUNITIES APIS ────────────────────────────────────────

export const resourcesApi = {
  async list(): Promise<PaginatedResult<ApiResource>> {
    return request<PaginatedResult<ApiResource>>('/v1/resources?limit=50')
  },
  async getById(id: string): Promise<ApiResource> {
    const res = await request<{ data: ApiResource }>(`/v1/resources/${id}`)
    return res.data
  }
}

export const opportunitiesApi = {
  async list(): Promise<PaginatedResult<ApiOpportunity>> {
    return request<PaginatedResult<ApiOpportunity>>('/v1/opportunities?limit=50')
  },
  async getById(id: string): Promise<ApiOpportunity> {
    const res = await request<{ data: ApiOpportunity }>(`/v1/opportunities/${id}`)
    return res.data
  }
}
