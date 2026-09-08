# API Documentation

Base URL: `http://localhost:3000` (configurable via `APP_URL` / `PORT`)

All `/api/v1/*` responses (except where noted) use the envelope:

```json
{ "data": <payload>, "meta": { ... } }
```

Errors always use:

```json
{ "error": { "code": "ERROR_CODE", "message": "Human readable message", "details": {} } }
```

## Conventions

- **Auth**: session-based, via [better-auth](https://better-auth.com). The client authenticates against `/api/auth/*` and the server sets an `httpOnly` session cookie (`platform.session_token` by default). All `/api/v1/*` routes marked "Auth: required" expect that cookie to be present.
- **Rate limiting**: enforced via `express-rate-limit`.
  - General `/api/v1/*` traffic: 100 requests / 15 min per IP.
  - Auth endpoints (`sign-in`, `sign-up`, `forgot-password`, `reset-password`, `send-verification-email`): 15 requests / 15 min per IP.
  - `/api/v1/ai/navigate`: 20 requests / hour per IP.
  - Exceeding a limit returns `429 RATE_LIMIT_EXCEEDED`.
- **Validation errors** return `400 VALIDATION_ERROR` with a `details` object describing the failing fields (from Zod).
- **Common error codes**: `VALIDATION_ERROR` (400), `UNAUTHORIZED` (401), `FORBIDDEN` (403), `NOT_FOUND` (404), `CONFLICT` (409), `RATE_LIMIT_EXCEEDED` (429), `INTERNAL_ERROR` (500).

---

## Auth — `/api/auth/*`

Auth is handled entirely by better-auth's Express adapter (`toNodeHandler`), mounted at `/api/auth`. The endpoints below are the standard better-auth email/password endpoints enabled in this project (see `apps/api/src/modules/auth/auth.service.ts`).

### POST /api/auth/sign-up/email

Create a new account.

- **Auth**: not required
- **Rate limit**: 15 / 15 min
- **Request body**:
  ```json
  { "email": "user@example.com", "password": "at-least-8-chars", "name": "Jane Doe" }
  ```
- **Response** `200`:
  ```json
  {
    "user": { "id": "usr_123", "email": "user@example.com", "name": "Jane Doe", "emailVerified": false, "role": "user" },
    "session": { "token": "...", "expiresAt": "2026-09-15T00:00:00.000Z" }
  }
  ```
  A session cookie is also set on the response.
- **Errors**: `422`/`400` if email already registered or password too weak (better-auth returns its own error shape: `{ "message": "...", "code": "..." }`).

### POST /api/auth/sign-in/email

Sign in with email + password.

- **Auth**: not required
- **Rate limit**: 15 / 15 min
- **Request body**:
  ```json
  { "email": "user@example.com", "password": "at-least-8-chars" }
  ```
- **Response** `200`: same shape as sign-up (`user`, `session`), sets the session cookie.
- **Errors**: `401` invalid credentials.

### POST /api/auth/sign-out

Sign out the current session (clears the session cookie).

- **Auth**: required (session cookie)
- **Response** `200`: `{ "success": true }`

### GET /api/auth/verify-email?token=...

Verify a user's email using the token sent by `sendVerificationEmail` (see `auth.service.ts`, delivered via Resend).

- **Auth**: not required
- **Query params**: `token` (string, required)
- **Response** `200`: `{ "status": "success" }` (or redirects to `callbackURL` if provided)
- **Errors**: `400` invalid/expired token.

> Note: `requireEmailVerification` is disabled for this MVP, so users may sign in before verifying their email.

### POST /api/auth/forgot-password

Request a password-reset email.

- **Auth**: not required
- **Rate limit**: 15 / 15 min
- **Request body**:
  ```json
  { "email": "user@example.com", "redirectTo": "https://app.example.com/reset-password" }
  ```
- **Response** `200`: `{ "status": true }` — always returns success regardless of whether the email exists (prevents user enumeration).

### POST /api/auth/reset-password

Complete a password reset using the token from the reset email.

- **Auth**: not required
- **Rate limit**: 15 / 15 min
- **Request body**:
  ```json
  { "newPassword": "new-at-least-8-chars", "token": "reset-token-from-email" }
  ```
- **Response** `200`: `{ "status": true }`
- **Errors**: `400` invalid/expired token.

---

## Profile — `/api/v1/profile`

### GET /api/v1/profile

Get the current user's profile.

- **Auth**: required
- **Response** `200`:
  ```json
  { "data": null, "meta": {} }
  ```
  or, if the profile exists:
  ```json
  {
    "data": {
      "id": "profile-1",
      "userId": "usr_123",
      "bio": null,
      "originCountry": "Egypt",
      "targetCountry": "USA",
      "currentCity": null,
      "languages": ["Arabic", "English"],
      "interests": ["Employment", "Housing"],
      "goals": null,
      "immigrationStatus": null,
      "visaType": null,
      "arrivalDate": null,
      "profileComplete": true,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    },
    "meta": {}
  }
  ```
- **Errors**: `401 UNAUTHORIZED` if not signed in.

### PUT /api/v1/profile

Create or update the current user's profile.

- **Auth**: required
- **Request body** (`ProfileUpdateSchema`, all fields optional):
  ```json
  {
    "bio": "string, max 500 chars",
    "originCountry": "string, 2-100 chars",
    "targetCountry": "string, 2-100 chars",
    "currentCity": "string, max 100 chars",
    "languages": ["string", "..."],
    "interests": ["string", "..."],
    "goals": "string, max 1000 chars",
    "immigrationStatus": "CITIZEN | PERMANENT_RESIDENT | WORK_VISA | STUDENT_VISA | ASYLUM_SEEKER | REFUGEE | TOURIST | OTHER",
    "visaType": "string, max 50 chars",
    "arrivalDate": "ISO 8601 datetime string"
  }
  ```
  `languages` and `interests`, when provided, must have 1–10 and 1–20 entries respectively.
- **Response** `200`: `{ "data": <ProfileResponse>, "meta": {} }` (see GET shape above).
- **Errors**: `400 VALIDATION_ERROR` for invalid fields, `401 UNAUTHORIZED`.

### POST /api/v1/profile/complete

Mark onboarding as complete. Requires the profile to already have enough required fields filled in.

- **Auth**: required
- **Request body**: none
- **Response** `200`: `{ "data": <ProfileResponse>, "meta": { "message": "Onboarding complete" } }`
- **Errors**:
  - `400 VALIDATION_ERROR` if the profile is not complete enough to finish onboarding.
  - `401 UNAUTHORIZED`.

---

## Communities — `/api/v1/communities` (public)

### GET /api/v1/communities

List communities with pagination and filters.

- **Auth**: not required
- **Query params**:
  | Param | Type | Notes |
  |---|---|---|
  | `page` | number | default `1` |
  | `limit` | number | default `20`, max `100` |
  | `categoryId` | string | optional |
  | `languageId` | string | optional |
  | `interestId` | string | optional |
  | `search` | string | max 100 chars, optional |
- **Response** `200`:
  ```json
  {
    "data": [
      {
        "id": "c1", "name": "Egyptian Expats NYC", "slug": "egyptian-expats-nyc",
        "description": "...", "websiteUrl": null, "contactEmail": null, "joinUrl": null,
        "memberCount": 250, "isVerified": true, "verificationStatus": "VERIFIED",
        "category": { "id": "cat1", "name": "Regional", "slug": "regional" },
        "languages": [{ "id": "l1", "code": "ar", "name": "Arabic" }],
        "interests": [{ "id": "i1", "name": "Networking", "slug": "networking" }],
        "createdAt": "2026-01-01T00:00:00.000Z", "updatedAt": "2026-01-01T00:00:00.000Z"
      }
    ],
    "meta": { "page": 1, "limit": 20, "total": 1, "totalPages": 1 }
  }
  ```
- **Errors**: `400 VALIDATION_ERROR` for invalid query params.

### GET /api/v1/communities/:id

Get a single community by ID.

- **Auth**: not required
- **Response** `200`: `{ "data": <CommunityResponse>, "meta": {} }`
- **Errors**: `404 NOT_FOUND` if the community does not exist.

> A companion route `GET /api/v1/communities/slug/:slug` looks up a community by its slug with the same response shape.

---

## Resources — `/api/v1/resources` (public)

### GET /api/v1/resources

List resources with pagination and filters.

- **Auth**: not required
- **Query params**:
  | Param | Type | Notes |
  |---|---|---|
  | `page` | number | default `1` |
  | `limit` | number | default `20`, max `100` |
  | `categoryId` | string | optional |
  | `interestId` | string | optional |
  | `type` | `ARTICLE \| VIDEO \| GUIDE \| TOOL \| WEBSITE` | optional |
  | `search` | string | max 100 chars, optional |
- **Response** `200`:
  ```json
  {
    "data": [
      {
        "id": "r1", "title": "Guide to US Visas", "slug": "guide-to-us-visas",
        "description": "...", "url": "https://example.com/guide", "type": "GUIDE",
        "isVerified": true, "verificationStatus": "VERIFIED",
        "category": { "id": "cat1", "name": "Immigration" },
        "interests": [{ "id": "i1", "name": "Legal" }],
        "createdAt": "2026-01-01T00:00:00.000Z", "updatedAt": "2026-01-01T00:00:00.000Z"
      }
    ],
    "meta": { "page": 1, "limit": 20, "total": 1, "totalPages": 1 }
  }
  ```
- **Errors**: `400 VALIDATION_ERROR` for invalid query params.

### GET /api/v1/resources/:id

Get a single resource by ID.

- **Auth**: not required
- **Response** `200`: `{ "data": <ResourceResponse>, "meta": {} }`
- **Errors**: `404 NOT_FOUND`.

---

## Opportunities — `/api/v1/opportunities` (public)

### GET /api/v1/opportunities

List opportunities with pagination and filters.

- **Auth**: not required
- **Query params**:
  | Param | Type | Notes |
  |---|---|---|
  | `page` | number | default `1` |
  | `limit` | number | default `20`, max `100` |
  | `type` | `JOB \| SCHOLARSHIP \| GRANT \| INTERNSHIP \| PROGRAM` | optional |
  | `interestId` | string | optional |
  | `targetCountry` | string | optional |
  | `search` | string | max 100 chars, optional |
- **Response** `200`:
  ```json
  {
    "data": [
      {
        "id": "o1", "title": "Software Engineer Internship", "slug": "swe-internship",
        "description": "...", "type": "INTERNSHIP", "organizationName": "Acme Corp",
        "applicationUrl": "https://example.com/apply", "deadline": "2026-12-01T00:00:00.000Z",
        "isVerified": true, "verificationStatus": "VERIFIED", "targetCountry": "USA",
        "requirements": "...", "interests": [{ "id": "i1", "name": "Tech" }],
        "createdAt": "2026-01-01T00:00:00.000Z", "updatedAt": "2026-01-01T00:00:00.000Z"
      }
    ],
    "meta": { "page": 1, "limit": 20, "total": 1, "totalPages": 1 }
  }
  ```
- **Errors**: `400 VALIDATION_ERROR` for invalid query params.

### GET /api/v1/opportunities/:id

Get a single opportunity by ID.

- **Auth**: not required
- **Response** `200`: `{ "data": <OpportunityResponse>, "meta": {} }`
- **Errors**: `404 NOT_FOUND`.

---

## Recommendations — `/api/v1/recommendations`

### GET /api/v1/recommendations

Get personalized recommendations for the current user, based on their profile (interests, languages, target country).

- **Auth**: required
- **Response** `200`:
  ```json
  {
    "data": {
      "communities": [ { "...CommunityResponse fields...": "...", "score": 0.92 } ],
      "resources": [ { "...ResourceResponse fields...": "...", "score": 0.81 } ],
      "opportunities": [ { "...OpportunityResponse fields...": "...", "score": 0.75 } ]
    },
    "meta": {}
  }
  ```
- **Errors**: `401 UNAUTHORIZED`.

---

## AI — `/api/v1/ai`

### POST /api/v1/ai/navigate

Ask the AI navigator a free-text question; it returns an explanation plus ranked entity references drawn from the platform's communities, resources, and opportunities.

- **Auth**: required
- **Rate limit**: 20 / hour per IP
- **Request body** (`NavigateRequestSchema`):
  ```json
  { "query": "I just moved to the US on a work visa, what should I do first?" }
  ```
  `query`: string, 1–500 chars.
- **Response** `200`:
  ```json
  {
    "data": {
      "explanation": "Based on your profile...",
      "navigationAdvice": "Start by joining a local community...",
      "communities": [ { "id": "c1", "reason": "Matches your target country and language" } ],
      "resources": [ { "id": "r1", "reason": "Explains the work-visa process" } ],
      "opportunities": [ { "id": "o1", "reason": "Open to work-visa holders" } ]
    },
    "meta": { "aiAvailable": true, "generatedAt": "2026-09-08T00:00:00.000Z" }
  }
  ```
  When the configured AI provider is unavailable, `meta.aiAvailable` is `false` and the response falls back to a deterministic explanation/advice.
- **Errors**: `400 VALIDATION_ERROR` (empty/too-long query), `401 UNAUTHORIZED`, `429 RATE_LIMIT_EXCEEDED`.

---

## Analytics — `/api/v1/analytics`

### POST /api/v1/analytics/track

Record an analytics event. Fire-and-forget: the request returns immediately without waiting for the event to be persisted.

- **Auth**: optional (attaches `userId` when a session is present, otherwise tracks anonymously)
- **Request body** (`TrackEventSchema`):
  ```json
  {
    "eventType": "ONBOARDING_COMPLETE | RECOMMENDATION_GENERATED | COMMUNITY_VIEW | RESOURCE_VIEW | OPPORTUNITY_VIEW | AI_NAVIGATE",
    "properties": { "entityId": "c1" }
  }
  ```
  `properties` is an arbitrary object; defaults to `{}`.
- **Response** `202`:
  ```json
  { "data": { "accepted": true } }
  ```
- **Errors**: `400 VALIDATION_ERROR` for an invalid `eventType`.

---

## Verification — `/api/v1/verification`

### GET /api/v1/verification/:entityType/:entityId

Get the verification status of an entity (community, resource, or opportunity).

- **Auth**: not required
- **Path params**:
  | Param | Type | Notes |
  |---|---|---|
  | `entityType` | `RESOURCE \| OPPORTUNITY \| COMMUNITY` | required |
  | `entityId` | string | required |
- **Response** `200`, if a verification record exists:
  ```json
  {
    "data": {
      "id": "v1", "entityType": "COMMUNITY", "entityId": "c1", "status": "VERIFIED",
      "verifiedAt": "2026-01-01T00:00:00.000Z", "verifiedBy": "admin-usr-1",
      "notes": "Confirmed via website", "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  }
  ```
  If no record exists yet:
  ```json
  { "data": { "entityType": "COMMUNITY", "entityId": "c1", "status": "UNVERIFIED" } }
  ```
- **Errors**: `400 VALIDATION_ERROR` for an invalid `entityType`.

### POST /api/v1/verification/:entityType/:entityId/verify

Mark an entity as verified. Admin-only.

- **Auth**: required, role `admin` (`403 FORBIDDEN` for non-admins)
- **Path params**: same as GET above.
- **Request body** (`VerifyEntityBodySchema`):
  ```json
  { "notes": "string, max 2000 chars, optional" }
  ```
- **Response** `200`:
  ```json
  {
    "data": {
      "id": "v1", "entityType": "COMMUNITY", "entityId": "c1", "status": "VERIFIED",
      "verifiedAt": "2026-09-08T00:00:00.000Z", "verifiedBy": "admin-usr-1",
      "notes": "Confirmed via website", "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-09-08T00:00:00.000Z"
    }
  }
  ```
- **Errors**: `400 VALIDATION_ERROR` (invalid params/body), `401 UNAUTHORIZED`, `403 FORBIDDEN` (non-admin).

---

## Health check

### GET /health

- **Auth**: not required
- **Response** `200`: `{ "status": "ok" }`
