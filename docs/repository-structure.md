# Repository Structure & Architecture

The WASL repository follows a strictly defined **client/server feature-based architecture**. It uses a monorepo setup via `pnpm` to ensure shared logic and types stay perfectly in sync.

```text
WASL/
├── apps/
│   ├── web/              # React client (Vite, React Router, Redux Toolkit, Tailwind)
│   └── api/              # Express server (Node.js, Prisma, Zod)
│
├── packages/
│   ├── contracts/        # Shared Zod schemas and runtime types
│   └── config/           # Shared workspace configuration (e.g., TS)
│
├── docs/                 # Documentation
├── package.json
├── pnpm-workspace.yaml
└── .env.example
```

## Feature Boundaries

### Client Architecture (`apps/web`)

The frontend is feature-oriented. Instead of separating files purely by technical function (all hooks together, all components together), code is grouped by the product feature it belongs to:

- `src/features/onboarding/`: Profile inputs, user journey initialization.
- `src/features/plan/`: The personalized starter plan and task execution.
- `src/features/communities/`: Community discovery, details, and filtering.
- `src/features/resources/`: External resources and links.
- `src/features/navigation/`: Cross-feature application navigation UI.

Shared layout components and API clients are kept in `src/components/shared/` and `src/lib/api/` respectively.

### Server Architecture (`apps/api`)

The backend follows a modular monolith pattern. Code is grouped into domain modules:

- `src/modules/profiles/`: Profile CRUD operations.
- `src/modules/communities/`: Community ingestion and retrieval.
- `src/modules/resources/`: External resource management.
- `src/modules/recommendations/`: Deterministic recommendation engine algorithms.
- `src/modules/ai/`: Isolated boundaries for AI provider interactions.

Shared cross-cutting concerns like validation and error handling live in `src/middleware/` and `src/shared/`.

## State Ownership

To prevent state fragmentation and complex synchronization issues, the WASL client enforces rigid state ownership boundaries:

1. **Server/API Data**: Owned exclusively by **TanStack Query** (`@tanstack/react-query`). Do not copy API data into Redux.
2. **Global Client State**: Owned by **Redux Toolkit** (e.g., UI themes, transient user preferences).
3. **Form State**: Managed locally by **React Hook Form**.
4. **Local UI State**: Handled natively by React's `useState` or `useReducer`.

## API Boundary

The application strictly follows a decoupled boundary:
- The React client never queries the database or calls the AI provider directly.
- The `packages/contracts` workspace ensures that the data sent by the client and the data validated by the server use the exact same Zod schemas.

## AI Boundary

AI logic is strictly cordoned off behind a server-side endpoint (`/api/v1/ai/navigate`). 
AI is only invoked **after** the deterministic recommendation engine has filtered and selected valid product data. This ensures that the AI cannot invent non-existent communities, resources, or application features (hallucination prevention).
