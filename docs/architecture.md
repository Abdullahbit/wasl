# Architecture

## System shape

```text
Browser / React 19
        |
        | same-origin HTTPS + JSON + HTTP-only session cookie
        v
Express 5 modular monolith
        |
        +--> Better Auth + Resend
        +--> Prisma Client --> Supabase PostgreSQL
        +--> deterministic ranking --> selected AI provider
```

Local Vite development proxies `/api/*` to Express. Production should expose the built web application and API under one public origin whenever practical.

## Workspace responsibilities

| Area | Owns | Must not own |
|---|---|---|
| `apps/client/src/pages` | Route-level composition and metadata | Database calls or business rules |
| `apps/client/src/features` | Feature UI, query keys, validated API calls | Server authorization |
| `apps/client/src/store` | Long-lived client-owned state | API response copies or credentials |
| `apps/server/src/modules` | Feature routes and application workflows | Cross-feature dumping-ground utilities |
| `apps/server/src/db` | Shared Prisma client | Per-request Prisma instances |
| `packages/contracts` | External Zod contracts and DTO types | Prisma or UI-specific types |

## Server request flow

```text
request ID -> structured logging -> route rate limit -> authentication
           -> Zod validation -> feature workflow -> Prisma/provider
           -> response envelope -> centralized error handling
```

Routes return `{ "data": ... }`, with `{ "meta": ... }` for collections. Errors return one stable `{ "error": { code, message, details?, requestId? } }` shape. Production errors never expose stack traces.

## Server modules

- `auth`: Better Auth configuration, Prisma adapter, email verification/reset, session middleware.
- `profiles`: authenticated user-owned onboarding profile.
- `communities`: public discovery of curated communities.
- `resources`: public discovery of curated resources.
- `opportunities`: verified opportunity discovery.
- `recommendations`: deterministic scoring for the authenticated profile.
- `ai`: rate-limited grounded navigation and provider boundary.

Small read modules keep database access near their routes. Extract a repository or service when logic becomes reusable, independently testable, or complex—not simply to add layers.

## Client state ownership

```text
Server/API state       -> TanStack Query
App-wide client state -> Redux Toolkit
Form state            -> React Hook Form
Component-only state  -> React state
```

The implemented community feature and onboarding form are reference patterns teammates can copy.

## Authentication and authorization

Better Auth is mounted before `express.json()` because it consumes its own request body. The browser uses `better-auth/react`, and credentials are sent with same-origin cookies. Protected routes resolve the session server-side and always derive `userId` from that session. Browser-supplied user IDs are never authorization evidence.

## AI safety boundary

The deterministic ranking runs first over verified database communities. Only top approved candidates may be sent to an AI adapter. The returned object is parsed with Zod, and steps referencing unknown community IDs are removed. If the provider is missing or fails, the API returns deterministic recommendations with a warning.

The provider-neutral adapter intentionally fails closed until the team selects a provider. Connect it in `apps/server/src/modules/ai/ai.service.ts`; do not put provider code or keys in React.

## Deliberate MVP exclusions

No Redis, queue, microservice, GraphQL layer, vector database, Kubernetes, or WebSocket infrastructure is included. In-memory rate limiting is appropriate for one hackathon API instance; move it to shared storage only when horizontally scaling.
