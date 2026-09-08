// Minimal structural types shared by the pure scoring functions.
// Deliberately loose — real service objects (CommunityResponse, ResourceResponse,
// OpportunityResponse) satisfy these shapes structurally.

export interface ScoringProfile {
  languages: string[]
  interests: string[]
  targetCountry?: string | null | undefined
}

export interface ScorableLanguage {
  code: string
  name: string
}

export interface ScorableInterest {
  name: string
}
