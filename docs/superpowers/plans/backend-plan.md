# Backend Implementation Plan — Immigrant Community Platform

## Context

Hackathon project: an immigrant/international student community platform that connects users with relevant communities, resources, and opportunities via a recommendation engine and AI navigator.

**Tech stack (locked):** Node.js 24 LTS · TypeScript strict · ESM · pnpm workspaces · Express 5 · Zod · Better Auth · Resend · Prisma ORM · Supabase PostgreSQL · Pino · Helmet · express-rate-limit · Vitest · Supertest

**Repository root:** C:\Users\Mahmoud\OneDrive\Desktop\Hackthon

## Global Constraints

- TypeScript: `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`
- No `any` at application boundaries
- All external inputs validated with Zod
- ESM throughout (`"type": "module"` in all package.json)
- pnpm workspaces monorepo
- Prisma is the ONLY database access layer
- API base: `/api/v1`; auth: `/api/auth/*`
- Success response: `{ "data": {}, "meta": {} }`
- Error response: `{ "error": { "code": "...", "message": "...", "details": {} } }`
- Never expose stack traces in production
- Cookie-based sessions only (no localStorage tokens)
- AI must never invent communities, resources, opportunities, verification statuses
- Recommendation engine: database filtering → deterministic scoring → AI explanation → Zod validation → entity ID validation
- No microservices, Redis, WebSockets, GraphQL, Kafka, Elasticsearch
- No CLAUDE.md modifications, no global config changes
- Do NOT implement frontend/UI

## Tasks

### Task 1: Monorepo Foundation + Shared Contracts

Set up the pnpm workspace monorepo with:
- Root `package.json` (workspace config, shared scripts)
- Root `pnpm-workspace.yaml`
- Root `tsconfig.base.json` (strict settings)
- `.gitignore`, `.env.example`
- `packages/contracts/` package with:
  - `package.json`
  - `tsconfig.json`
  - `src/index.ts` re-exporting all contracts
  - `src/schemas/` directory with Zod schemas for all API contracts:
    - `auth.ts` (register, login, forgotPassword, resetPassword)
    - `profile.ts` (onboarding/profile update, profile response)
    - `community.ts` (community list params, community response, community detail)
    - `resource.ts` (resource list params, resource response)
    - `opportunity.ts` (opportunity list params, opportunity response)
    - `recommendation.ts` (recommendation request, recommendation response)
    - `ai.ts` (navigate request, navigate response)
    - `analytics.ts` (event types enum, track event request)
    - `common.ts` (pagination, success response, error response wrappers)
  - `src/types/` directory with TypeScript types inferred from Zod schemas

**Deliverables:** All files committed. `pnpm install` succeeds. `pnpm -F @platform/contracts build` succeeds (tsc --noEmit passes).

### Task 2: Database Schema + Environment Config

In `apps/api/`:
- `package.json` with all deps:
  - express@^5, @types/express, typescript, tsx, tsup
  - @prisma/client, prisma
  - better-auth
  - resend
  - zod
  - pino, pino-http, pino-pretty
  - helmet
  - express-rate-limit
  - uuid, @types/uuid
  - vitest, @vitest/coverage-v8, supertest, @types/supertest
  - @platform/contracts (workspace dep)
- `tsconfig.json` (extends base, strict)
- `prisma/schema.prisma` with ALL models:
  - Better Auth models: `user`, `session`, `account`, `verification`
  - `profile` (linked to user, onboarding fields: bio, originCountry, targetCountry, languages[], interests[], goals, immigrationStatus, visaType, arrivalDate, currentCity, profileComplete)
  - `category` (name, slug, description)
  - `language` (code, name)
  - `interest` (name, slug)
  - `community` (name, slug, description, categoryId, websiteUrl, contactEmail, joinUrl, memberCount, isVerified, isActive, createdAt, updatedAt; relations to language, interest, verificationRecord)
  - `communityLanguage` (communityId, languageId — join table)
  - `communityInterest` (communityId, interestId — join table)
  - `resource` (title, slug, description, url, type[ARTICLE/VIDEO/GUIDE/TOOL/WEBSITE], categoryId, isVerified, isActive)
  - `resourceInterest` (resourceId, interestId)
  - `opportunity` (title, slug, description, type[JOB/SCHOLARSHIP/GRANT/INTERNSHIP/PROGRAM], organizationName, applicationUrl, deadline, isVerified, isActive, targetCountry, requirements)
  - `opportunityInterest` (opportunityId, interestId)
  - `recommendationEvent` (userId, type[COMMUNITY/RESOURCE/OPPORTUNITY], entityId, score, algorithm, metadata JSON, createdAt)
  - `analyticsEvent` (userId nullable, eventType, properties JSON, sessionId, createdAt)
  - `verificationRecord` (entityType[COMMUNITY/RESOURCE/OPPORTUNITY], entityId, status[PENDING/VERIFIED/REJECTED], verifiedAt, verifiedBy, notes)
  - All models: proper PKs (cuid), FKs, unique constraints, indexes on slug/userId/entityId, timestamps, cascade deletes where appropriate
- `src/config/env.ts` — Zod validation of all env vars:
  - NODE_ENV, PORT, APP_URL, DATABASE_URL, DIRECT_URL
  - BETTER_AUTH_SECRET, BETTER_AUTH_URL
  - RESEND_API_KEY, RESEND_FROM_EMAIL
  - AI_PROVIDER (anthropic|openai), AI_PROVIDER_API_KEY, AI_MODEL
  - CORS_ORIGIN (optional)
- `.env.example` with all required vars (no real secrets)
- `prisma/seed.ts` stub (full seed in Task 11)

**Deliverables:** All files committed. `pnpm prisma validate` passes on the schema. `pnpm --filter @platform/api build` (tsc --noEmit) passes on the config/env.ts file.

### Task 3: Express App Core + Middleware Stack

In `apps/api/src/`:
- `config/logger.ts` — Pino logger (structured, request-id aware, never log passwords/tokens/secrets)
- `db/client.ts` — singleton Prisma client
- `middleware/request-id.ts` — attach UUID request ID to req and response header
- `middleware/error-handler.ts` — centralized error handler, maps AppError subclasses to HTTP status codes, never exposes stack in production
- `middleware/validate.ts` — Zod validation factory for body/query/params
- `middleware/rate-limit.ts` — exports named limiters: `authLimiter` (15 req/15min), `aiLimiter` (20 req/hour), `generalLimiter` (100 req/15min)
- `middleware/auth.ts` — `requireAuth` middleware (derives user from Better Auth session cookie, never trusts client-supplied user IDs), `requireRole(role)` factory
- `shared/errors/AppError.ts` — AppError base class, subclasses: ValidationError (400), UnauthorizedError (401), ForbiddenError (403), NotFoundError (404), ConflictError (409), RateLimitError (429), InternalError (500)
- `shared/utilities/pagination.ts` — parse page/limit from query, return skip/take for Prisma
- `app.ts` — Express app factory:
  - Helmet with sensible defaults
  - CORS (configurable origin, credentials: true)
  - JSON body parser (limit: 100kb)
  - requestId middleware
  - pino-http request logging (logs requestId, method, url, status, responseTime, userId where available — never logs Authorization headers or cookies)
  - Rate limiting on appropriate route groups
  - Mount `/api/auth` for Better Auth handler
  - Mount `/api/v1` router
  - 404 handler
  - Centralized error handler
- `server.ts` — create app, listen on PORT, graceful shutdown

**Deliverables:** All files committed. App boots (no import errors). TypeScript passes. At least one smoke test: POST /api/v1/unknown → 404 JSON error.

### Task 4: Authentication Module

In `apps/api/src/modules/auth/`:
- `auth.service.ts` — configure Better Auth:
  - Prisma adapter
  - emailAndPassword plugin (register, login, forgot/reset password)
  - Email verification plugin
  - Sessions: cookie-based, httpOnly, Secure in prod, SameSite=lax
  - Roles: user, admin (via user.role field)
  - Resend email provider for verification and password reset emails
  - After register: send verification email via Resend
  - After password reset: revoke all existing sessions
- `auth.router.ts` — mount `betterAuth.handler` on `/api/auth/*` (Better Auth handles all auth HTTP)
- `auth.types.ts` — export Session and User types from Better Auth

**Integration:**
- `app.ts` already imports and mounts auth router
- `middleware/auth.ts` uses `betterAuth.api.getSession()` to verify sessions

**Tests** (`auth.test.ts`):
- POST /api/auth/sign-up — validates email/password, returns user
- POST /api/auth/sign-in — returns session cookie
- GET /api/v1/profile (protected) without session → 401
- POST /api/auth/sign-out — clears session
- Rate limiting: >15 sign-in attempts → 429

**Deliverables:** Auth routes mounted and functional. Tests pass.

### Task 5: Profile Module

In `apps/api/src/modules/profiles/`:
- `profile.repository.ts` — Prisma queries: findByUserId, upsert, markComplete
- `profile.service.ts` — getProfile, upsertProfile (validates completeness threshold), markOnboardingComplete
- `profile.controller.ts` — HTTP handlers
- `profile.router.ts` — all routes require auth:
  - `GET /api/v1/profile` — return current user's profile (derive userId from session, never from request body/params)
  - `PUT /api/v1/profile` — create or update profile (Zod validated against contracts package schema)
  - `POST /api/v1/profile/complete` — mark onboarding complete (triggers analytics event)
- `profile.schema.ts` — local Zod schemas (import/re-export from @platform/contracts)

**Rules:**
- userId ALWAYS from session (req.user.id), never from request body
- Validate all profile fields (languages array non-empty for complete, etc.)
- Trigger `ONBOARDING_COMPLETE` analytics event on completion

**Tests** (`profile.test.ts`):
- Unauthenticated → 401
- GET profile before creation → 404 or empty profile
- PUT with invalid data → 400 with validation errors
- PUT with valid data → 200, profile persisted
- GET after PUT → returns updated profile

**Deliverables:** All endpoints working. Tests pass.

### Task 6: Communities Module

In `apps/api/src/modules/communities/`:
- `community.repository.ts` — Prisma queries with filtering:
  - list(filters: { categoryId?, languageId?, interestId?, search?, page, limit }) → paginated communities with relations
  - findById(id) → community with full relations (category, languages, interests, verificationRecord)
  - findBySlug(slug)
  - findCandidates(profileInterests[], profileLanguages[]) → for recommendation engine (active + verified communities)
- `community.service.ts` — getCommunities, getCommunity, getCandidatesForProfile
- `community.controller.ts` — HTTP handlers
- `community.router.ts`:
  - `GET /api/v1/communities` — list with filters/pagination (public, no auth required)
  - `GET /api/v1/communities/:id` — community detail (public)
  - `GET /api/v1/communities/slug/:slug` — by slug (public)

**Rules:**
- Only return `isActive: true` communities to public
- Never fabricate communities — only DB records
- Include verificationRecord status in response

**Tests** (`community.test.ts`):
- GET /communities → list with pagination
- GET /communities?categoryId=x → filters work
- GET /communities/:id → not found → 404
- GET /communities/:id → returns community with relations

**Deliverables:** All endpoints working. Tests pass.

### Task 7: Resources + Opportunities Modules

**Resources** in `apps/api/src/modules/resources/`:
- `resource.repository.ts` — list(filters: { categoryId?, interestId?, type?, search?, page, limit }), findById, findCandidates(interestIds[])
- `resource.service.ts` — getResources, getResource, getCandidatesForProfile  
- `resource.controller.ts`, `resource.router.ts`:
  - `GET /api/v1/resources` — list with filters
  - `GET /api/v1/resources/:id` — detail

**Opportunities** in `apps/api/src/modules/opportunities/`:
- `opportunity.repository.ts` — list(filters: { type?, interestId?, targetCountry?, search?, page, limit }), findById, findCandidates(interestIds[], targetCountry?)
- `opportunity.service.ts`, `opportunity.controller.ts`, `opportunity.router.ts`:
  - `GET /api/v1/opportunities` — list with filters
  - `GET /api/v1/opportunities/:id` — detail

**Rules for both:**
- Only return `isActive: true` records
- AI must never invent these — only DB records returned
- Include verificationRecord status

**Tests:** Basic list/detail/filter/404 tests for each (4 tests each minimum).

**Deliverables:** All endpoints working. Tests pass.

### Task 8: Recommendation Engine

In `apps/api/src/modules/recommendations/`:
- `scoring/community.scorer.ts` — pure function: `scoreCommunity(community, profile) → number`
  - +3 if any language matches profile.languages
  - +2 per overlapping interest (up to +6)
  - +1 if community.isVerified
  - +1 if community.memberCount > 100
  - Returns score 0-12
- `scoring/resource.scorer.ts` — pure function: `scoreResource(resource, profile) → number`
  - +2 per overlapping interest (up to +6)
  - +1 if isVerified
  - Returns score 0-7
- `scoring/opportunity.scorer.ts` — pure function: `scoreOpportunity(opportunity, profile) → number`
  - +2 per overlapping interest (up to +6)
  - +1 if targetCountry matches profile.targetCountry
  - +1 if isVerified
  - Returns score 0-8
- `recommendation.service.ts`:
  1. Load authenticated user's profile (error if incomplete)
  2. Query candidate communities (findCandidates), resources, opportunities from DB
  3. Score all candidates using scorers
  4. Sort descending by score, take top 5 communities, top 5 resources, top 3 opportunities
  5. Store recommendationEvent in DB
  6. Return grounded candidates (no AI at this layer)
- `recommendation.controller.ts`
- `recommendation.router.ts`:
  - `GET /api/v1/recommendations` — requires auth, requires profile complete
  - Response: `{ data: { communities: [...], resources: [...], opportunities: [...] }, meta: { generatedAt, algorithm: "deterministic-v1" } }`

**Tests** (`recommendation.test.ts`):
- `scoreCommunity`: unit tests for language match, interest overlap, verified bonus
- `scoreResource`: unit tests
- `scoreOpportunity`: unit tests  
- Integration: unauthenticated → 401
- Integration: authenticated, incomplete profile → 400
- Integration: authenticated, complete profile → 200 with recommendations

**Deliverables:** Scoring is unit-tested. Integration tests pass.

### Task 9: AI Navigator Module

In `apps/api/src/modules/ai/`:
- `ai.provider.ts` — provider abstraction:
  - `AiProvider` interface: `complete(systemPrompt, userPrompt, options) → Promise<string>`
  - `AnthropicProvider` — uses Anthropic SDK (claude-3-5-haiku-20241022 default, configurable via AI_MODEL env)
  - `OpenAiProvider` — stub for OpenAI (same interface)
  - `createAiProvider(config) → AiProvider` factory using AI_PROVIDER env var
  - API keys never leave the server
- `ai.grounding.ts`:
  - `buildGroundedContext(profile, communities[], resources[], opportunities[]) → string` — builds system prompt from ONLY approved DB entities. Explicitly instructs AI: "You MUST only reference the communities, resources, and opportunities listed below. Do NOT invent any entity. Do NOT claim any verification status not listed."
  - `validateGroundedResponse(response: unknown, approvedIds: Set<string>) → ValidatedAiResponse` — Zod validates AI output schema, checks every returned entity ID against approvedIds set
- `ai.schema.ts` — Zod schema for AI structured output: `{ explanation: string, rankedCommunities: [{id, reason}], rankedResources: [{id, reason}], rankedOpportunities: [{id, reason}], navigationAdvice: string }`
- `ai.service.ts`:
  Flow:
  1. Validate request (Zod)
  2. Load authenticated user profile
  3. Run recommendation engine to get grounded candidates (reuse recommendation.service)
  4. Build grounded context (buildGroundedContext)
  5. Call AI provider with 10-second timeout
  6. Parse and Zod-validate AI response
  7. `validateGroundedResponse` — reject any ID not in approved candidate set
  8. Store minimal analytics event (AI_NAVIGATE usage, no personal content)
  9. Return final response with entity details from DB (not from AI)
  - Fallback: if AI fails, return deterministic recommendations with no AI explanation
- `ai.controller.ts`, `ai.router.ts`:
  - `POST /api/v1/ai/navigate` — requires auth, rate limited (aiLimiter), Zod validated body: `{ query: string (max 500 chars) }`
  - Response includes grounded communities/resources/opportunities + AI explanation

**Tests** (`ai.test.ts`):
- Unauthenticated → 401
- Missing/invalid query → 400
- Rate limit enforcement (mock clock or real — at least verify header)
- `buildGroundedContext`: unit test verifies prompt contains entity IDs and grounding instruction
- `validateGroundedResponse`: unit test rejects invented IDs, accepts valid ones

**Deliverables:** AI provider abstraction works. Grounding validated. Tests pass.

### Task 10: Analytics + Verification Modules

**Analytics** in `apps/api/src/modules/analytics/`:
- `analytics.service.ts` — `trackEvent(userId: string | null, eventType: string, properties: Record<string, unknown>) → Promise<void>`
  - Writes to `analyticsEvent` table
  - Fire-and-forget pattern (never blocks the request)
  - Never log personal content in event properties
  - Event types: ONBOARDING_COMPLETE, RECOMMENDATION_GENERATED, COMMUNITY_VIEW, RESOURCE_VIEW, OPPORTUNITY_VIEW, AI_NAVIGATE
- `analytics.router.ts`:
  - `POST /api/v1/analytics/track` — authenticated, Zod validated, accepts eventType + properties

**Verification** in `apps/api/src/modules/verification/`:
- `verification.service.ts`:
  - `getVerificationStatus(entityType, entityId) → VerificationRecord | null`
  - `verifyEntity(entityType, entityId, verifiedBy, notes) → VerificationRecord` — admin only
- `verification.router.ts`:
  - `GET /api/v1/verification/:entityType/:entityId` — returns verification status (public)
  - `POST /api/v1/verification/:entityType/:entityId/verify` — admin only

**Tests:**
- `trackEvent`: fires without throwing, writes to DB
- Verification: public can read status, non-admin → 403 on verify

**Deliverables:** Both modules working. Tests pass.

### Task 11: Seed Data

In `apps/api/prisma/seed.ts`:
Create reproducible, realistic seed data:
- 3 categories: Immigration Support, Professional Development, Social Integration
- 5 languages: English, Arabic, Spanish, French, Mandarin
- 8 interests: Housing, Employment, Legal Aid, Healthcare, Education, Networking, Cultural Events, Language Learning
- 15 communities across categories/languages/interests (realistic names, descriptions, websites — all fictional but plausible for immigrant support)
- 10 resources (guides, tools, articles — each tagged with relevant interests)
- 8 opportunities (scholarships, programs, jobs — diverse types)
- 2 seed users: admin@platform.test (role: admin) + user@platform.test (role: user)
- 1 complete profile for the test user
- Verification records for some communities/resources
- All slugs must be URL-safe and unique

The seed must be idempotent (use upsert where possible). Run via `pnpm db:seed`.

The recommendation engine must return meaningful results when run against this seed data.

**Deliverables:** `prisma/seed.ts` runs without errors. 15+ communities in DB. Recommendation endpoint returns results for seeded user.

### Task 12: API Documentation + Quality Gate

**API Documentation** in `docs/api.md`:
Document every endpoint:
- Method, path, auth required, request schema, response schema, possible errors, example request/response

Endpoints to document:
- Auth: sign-up, sign-in, sign-out, verify-email, forgot-password, reset-password
- Profile: GET /profile, PUT /profile, POST /profile/complete
- Communities: GET /communities, GET /communities/:id
- Resources: GET /resources, GET /resources/:id
- Opportunities: GET /opportunities, GET /opportunities/:id
- Recommendations: GET /recommendations
- AI: POST /ai/navigate
- Analytics: POST /analytics/track
- Verification: GET /verification/:type/:id, POST /verification/:type/:id/verify

**Quality Gate** — run and fix all:
1. `pnpm -r typecheck` — must pass with 0 errors
2. `pnpm -r lint` (eslint) — must pass (configure eslint if not already)
3. `pnpm test` — all tests must pass
4. `pnpm prisma validate` — schema valid
5. `pnpm build` — production build succeeds

Fix any errors found. Do not leave type errors or test failures.

Add `apps/api/scripts/` with:
- `dev.sh` equivalent in package.json scripts
- All scripts: dev, build, start, typecheck, lint, test, test:watch, db:generate, db:migrate, db:seed

**Deliverables:** All quality gates pass. API doc complete. All scripts work.
