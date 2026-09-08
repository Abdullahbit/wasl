# Development Guide

## Prerequisites
- Node.js >= 20
- pnpm >= 8
- PostgreSQL

## Initial Setup
1. Clone the repository.
2. Run `pnpm install` in the root.
3. Copy `.env.example` to `.env` in the root and fill in `DATABASE_URL` and `DIRECT_URL`.
4. Run `pnpm db:push` inside `apps/api`.
5. Run `pnpm db:seed` inside `apps/api`.

## Running the Application
From the root:
- `pnpm dev` - Starts both backend and frontend concurrently.

## Testing
- `pnpm test` in the root or inside `apps/api` to run tests.
