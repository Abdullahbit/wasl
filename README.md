# WASL

WASL helps international students in Türkiye find verified communities, practical resources, opportunities, and grounded next steps.

This repository is a production-shaped, hackathon-simple TypeScript monorepo. The browser talks only to the Express API; the API owns authentication, authorization, database access, and AI provider credentials.

## Repository map

```text
apps/
  client/              React, Vite, routes, client state, feature UI
  server/              Express modular monolith, auth, Prisma, AI boundary
packages/
  contracts/           Shared Zod request/response contracts and DTO types
  config/              Shared strict TypeScript settings
docs/                  Architecture, API, development, and team guides
```

## Start locally

Prerequisites: Node.js 24, Corepack, and PostgreSQL (local or Supabase).

```bash
corepack pnpm install
```

Copy `.env.example` to `.env`, replace the database URLs and `BETTER_AUTH_SECRET`, then run:

```bash
corepack pnpm db:generate
corepack pnpm db:migrate
corepack pnpm db:seed
corepack pnpm dev
```

- Web: `http://localhost:5173`
- API health: `http://localhost:3000/api/v1/health`
- Auth API: `http://localhost:5173/api/auth/*` through the Vite same-origin proxy

## Validate a change

```bash
corepack pnpm check
```

That command runs type checking, linting, tests, and production builds across the workspace.

## Important boundaries

- Add shared HTTP schemas to `packages/contracts`; do not redefine API DTOs in an app.
- Put server-owned data in TanStack Query, app-wide browser state in Redux, form state in React Hook Form, and local UI state in React.
- Never query Supabase directly from React.
- Never store auth tokens in Redux or `localStorage`; Better Auth uses server sessions and HTTP-only cookies.
- AI may rank or explain approved database records, but must not invent entities or official guidance.
- Create Prisma migrations for schema changes and commit them.

## Documentation

- [Architecture](docs/architecture.md)
- [Development setup](docs/development.md)
- [API reference](docs/api.md)
- [Team workflow](docs/team-workflow.md)
- [AI architecture](docs/ai-architecture.md)
- [Recommendation engine](docs/recommendation-engine.md)

## Version note

The supplied requirements name React Router 8, but that version is not published. This repository uses the current installable release, React Router 7.18.3, while keeping one route tree and route-level boundaries that can be upgraded later.
