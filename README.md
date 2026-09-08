# WASL - AI-Powered Community Navigation

WASL is an AI-powered community navigation platform designed for international students arriving in Türkiye. It helps newcomers transition smoothly by recommending communities, resources, and actionable next steps based on their unique profiles.

## MVP Scope
The hackathon MVP demonstrates the core value proposition: **"What Should I Do Next?"**
It focuses on:
- Smart Onboarding (no registration required)
- Deterministic Community Matching (based on 10-15 verified communities)
- AI Personalization (grounded on deterministic candidates)
- Community Details & Recommendations

*Out of scope for MVP: Authentication, real-time messaging, comprehensive event management, microservices.*

## Architecture & Tech Stack
WASL uses a **Modular Monolith** architecture:
- **Frontend**: React, Vite, Tailwind CSS, TanStack Query, Zod.
- **Backend**: Express, TypeScript, Prisma, PostgreSQL (Supabase).
- **AI Boundary**: Server-side strictly validated structured AI responses.
- **Shared Contracts**: Zod schemas and TypeScript types shared between web and api via pnpm workspace.

## Repository Structure
```
wasl/
├── apps/
│   ├── web/        # Frontend application
│   └── api/        # Backend application
├── packages/
│   └── contracts/  # Shared Zod schemas and types
└── docs/           # Documentation
```

## Local Setup

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` in the root folder and fill in the values:
- `DATABASE_URL`: PostgreSQL connection string.
- `DIRECT_URL`: PostgreSQL connection string (for Prisma migrations).
- `AI_PROVIDER_API_KEY`: API key for the AI provider.

### 3. Database Setup
```bash
cd apps/api
pnpm db:push
pnpm db:seed
```

### 4. Development Commands
From the root directory:
- `pnpm dev` - Starts both frontend and backend in parallel.
- `pnpm build` - Builds all packages and apps.
- `pnpm lint` - Lints all packages.
- `pnpm typecheck` - Typechecks all packages.

### 5. Testing
```bash
pnpm test
```

## Documentation
Please refer to the `docs/` folder for detailed guides:
- [Architecture](docs/architecture.md)
- [API Reference](docs/api.md)
- [Recommendation Engine](docs/recommendation-engine.md)
- [AI Architecture](docs/ai-architecture.md)
- [Development](docs/development.md)
