# API reference

The versioned product API is `/api/v1`. Better Auth owns `/api/auth/*`. During local web development, call both through the Vite origin (`http://localhost:5173`) so cookies behave like production.

## Response shapes

Single result:

```json
{ "data": {} }
```

Collection:

```json
{ "data": [], "meta": { "total": 0 } }
```

Error:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [],
    "requestId": "..."
  }
}
```

## Routes

| Method | Route | Auth | Purpose |
|---|---|---:|---|
| GET | `/api/v1/health` | No | Process health |
| GET | `/api/v1/profile` | Yes | Current user's profile |
| PUT | `/api/v1/profile` | Yes | Create or replace current user's profile |
| GET | `/api/v1/communities` | No | Filterable community list |
| GET | `/api/v1/communities/:id` | No | Community details |
| GET | `/api/v1/resources` | No | Filterable resource list |
| GET | `/api/v1/resources/:id` | No | Resource details |
| GET | `/api/v1/opportunities` | No | Verified opportunity list |
| GET | `/api/v1/recommendations` | Yes | Deterministic recommendations |
| POST | `/api/v1/ai/navigate` | Yes | Grounded AI navigator with deterministic fallback |

Community filters: `city`, `category`, `language`, `verified=true|false`.

Resource filters: `category`.

Opportunity filters: `city`, `category`.

## Authentication

Use the Better Auth client in `apps/client/src/lib/authClient.ts`. It exposes typed sign-up, sign-in, session, password-reset, verification, and sign-out operations. Do not handcraft token storage or call protected product routes with a browser-provided user ID.

Protected product routes return `401 UNAUTHENTICATED` without a valid session and `409 PROFILE_REQUIRED` when onboarding is needed before recommendations.
