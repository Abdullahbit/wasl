import { AiOutputSchema, type AiOutput, type AiEntityRef } from './ai.schema.js'

// ─── Structural shapes for grounded entities ───────────────────────────────
// Deliberately loose — real recommendation-service candidates (which carry a
// `name` or `title`, description, verification flag, and score) satisfy these.

export interface GroundedProfile {
  languages: string[]
  interests: string[]
  targetCountry?: string | null | undefined
}

export interface GroundedCommunity {
  id: string
  name: string
  description: string
  isVerified: boolean
}

export interface GroundedResource {
  id: string
  title: string
  description: string
  isVerified: boolean
}

export interface GroundedOpportunity {
  id: string
  title: string
  description: string
  isVerified: boolean
}

export interface ValidatedAiResponse extends AiOutput {
  rejectedIds: string[]
}

const GROUNDING_INSTRUCTION =
  'You MUST only reference the communities, resources, and opportunities listed below. ' +
  'Do NOT invent any entity. Do NOT claim any verification status not listed. ' +
  'Every entity you reference in your ranked lists MUST use one of the exact IDs given below — ' +
  'never invent, guess, or modify an ID.'

/**
 * Builds a system prompt that grounds the AI strictly in the approved DB entities
 * passed in. The AI is never given free rein to invent communities, resources, or
 * opportunities — only to explain and rank the ones already selected by the
 * deterministic recommendation engine.
 */
export function buildGroundedContext(
  profile: GroundedProfile,
  communities: GroundedCommunity[],
  resources: GroundedResource[],
  opportunities: GroundedOpportunity[],
): string {
  const lines: string[] = []

  lines.push('You are an AI navigator helping an immigrant user find relevant support resources.')
  lines.push(GROUNDING_INSTRUCTION)
  lines.push('')
  lines.push('User profile:')
  lines.push(`- Languages: ${profile.languages.join(', ') || 'none specified'}`)
  lines.push(`- Interests: ${profile.interests.join(', ') || 'none specified'}`)
  lines.push(`- Target country: ${profile.targetCountry ?? 'not specified'}`)
  lines.push('')

  lines.push('Approved communities (reference ONLY these IDs):')
  for (const c of communities) {
    lines.push(`- id=${c.id} name="${c.name}" verified=${c.isVerified} description="${c.description}"`)
  }
  lines.push('')

  lines.push('Approved resources (reference ONLY these IDs):')
  for (const r of resources) {
    lines.push(`- id=${r.id} title="${r.title}" verified=${r.isVerified} description="${r.description}"`)
  }
  lines.push('')

  lines.push('Approved opportunities (reference ONLY these IDs):')
  for (const o of opportunities) {
    lines.push(`- id=${o.id} title="${o.title}" verified=${o.isVerified} description="${o.description}"`)
  }
  lines.push('')

  lines.push(
    'Respond with ONLY a JSON object matching this shape (no markdown, no commentary outside the JSON): ' +
      '{ "explanation": string, "rankedCommunities": [{"id": string, "reason": string}], ' +
      '"rankedResources": [{"id": string, "reason": string}], ' +
      '"rankedOpportunities": [{"id": string, "reason": string}], "navigationAdvice": string }',
  )

  return lines.join('\n')
}

function filterApproved(refs: AiEntityRef[], approvedIds: Set<string>): { kept: AiEntityRef[]; rejected: string[] } {
  const kept: AiEntityRef[] = []
  const rejected: string[] = []
  for (const ref of refs) {
    if (approvedIds.has(ref.id)) {
      kept.push(ref)
    } else {
      rejected.push(ref.id)
    }
  }
  return { kept, rejected }
}

/**
 * Validates the raw AI response against the structured-output schema, then
 * strips out (and reports) any entity ID that is not in the approved set —
 * i.e. any entity the AI invented rather than referencing from the DB.
 */
export function validateGroundedResponse(response: unknown, approvedIds: Set<string>): ValidatedAiResponse {
  const parsed = AiOutputSchema.parse(response)

  const communities = filterApproved(parsed.rankedCommunities, approvedIds)
  const resources = filterApproved(parsed.rankedResources, approvedIds)
  const opportunities = filterApproved(parsed.rankedOpportunities, approvedIds)

  return {
    explanation: parsed.explanation,
    navigationAdvice: parsed.navigationAdvice,
    rankedCommunities: communities.kept,
    rankedResources: resources.kept,
    rankedOpportunities: opportunities.kept,
    rejectedIds: [...communities.rejected, ...resources.rejected, ...opportunities.rejected],
  }
}
