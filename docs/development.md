# Development guide

## Prerequisites

- Node.js 24 LTS
- Corepack (included with the expected Node installation)
- PostgreSQL, either a local database or a Supabase project

Verify the runtime:

```bash
node --version
corepack pnpm --version
```

## First-time setup

1. Run `corepack pnpm install` at the repository root.
2. Copy `.env.example` to `.env`.
3. Replace `DATABASE_URL` and `DIRECT_URL` with server-only PostgreSQL connections.
4. Generate a random `BETTER_AUTH_SECRET` containing at least 32 characters.
5. Run `corepack pnpm db:generate`.
6. Run `corepack pnpm db:migrate`.
7. Run `corepack pnpm db:seed`.
8. Run `corepack pnpm dev`.

`RESEND_API_KEY` and `AI_PROVIDER_API_KEY` may be empty during local UI/database development. Auth emails are skipped with a server warning when Resend is not configured. AI navigation falls back to deterministic results until a provider adapter is connected.

## Database URLs

- `DATABASE_URL`: pooled runtime URL when Supabase pooling is used.
- `DIRECT_URL`: direct connection used by Prisma migration commands.

Both values stay on the server. Never add either to a `VITE_*` variable.

## Common commands

```bash
corepack pnpm dev          # Run all development watchers
corepack pnpm typecheck    # Strict TypeScript check
corepack pnpm lint         # ESLint across the workspace
corepack pnpm test         # Vitest across apps
corepack pnpm build        # Production builds
corepack pnpm check        # All validation above
corepack pnpm db:migrate   # Create/apply a development migration
corepack pnpm db:deploy    # Apply committed migrations in production
corepack pnpm db:seed      # Reproducible demo data
```

## Adding an API field or endpoint

1. Change or add the Zod contract in `packages/contracts/src`.
2. Export it from `packages/contracts/src/index.ts`.
3. Add the server behavior under its feature module.
4. Validate request body, query, params, and provider responses.
5. Return the standard data or error envelope.
6. Add the feature API function and query key in the web app.
7. Add readable tests, then run `corepack pnpm check`.

## Changing the database

Edit `apps/server/prisma/schema.prisma`, then run:

```bash
corepack pnpm db:migrate
corepack pnpm db:generate
```

Commit both the schema and generated migration SQL. Do not use `prisma db push` as the team workflow because it does not produce reviewable migrations.

## Environment troubleshooting

The API validates environment variables before startup. If it exits with `Invalid server environment`, compare `.env` with `.env.example`. Do not weaken validation or commit a real secret to make startup pass.
