# Team workflow

## Suggested ownership

These areas can be developed in parallel with limited overlap:

| Workstream | Primary paths |
|---|---|
| Authentication UI and flows | `apps/web/src/features/auth`, `apps/api/src/modules/auth` |
| Onboarding/profile | `apps/web/src/pages/OnboardingPage.tsx`, `apps/web/src/features/profiles`, `apps/api/src/modules/profiles` |
| Community discovery | `apps/web/src/features/communities`, `apps/api/src/modules/communities` |
| Resources/opportunities | matching modules in both apps, shared contracts |
| Recommendations/AI | `apps/api/src/modules/recommendations`, `apps/api/src/modules/ai` |
| Design system | `apps/web/src/components`, `apps/web/src/index.css` |

Coordinate any edit to `packages/contracts`, `schema.prisma`, or the root package files because those are shared integration points.

## Branches and commits

Use readable branches such as `feature/add-authentication-ui` or `fix/community-filter-validation`. Use commits such as `feat: add profile onboarding form` and `fix: reject unknown AI community ids`.

## Definition of done

- Runtime input is validated at the boundary.
- Protected behavior uses the server session.
- New source files have a short purpose comment.
- Components and functions have one understandable responsibility.
- User-facing controls are semantic and keyboard accessible.
- No secrets, tokens, or direct Supabase browser access were added.
- Database changes include a committed migration.
- `corepack pnpm check` passes.

## Reference implementations

- Copy `features/communities/communityApi.ts` for a TanStack Query API module.
- Copy `pages/OnboardingPage.tsx` for React Hook Form plus shared Zod validation.
- Copy `modules/communities/community.routes.ts` for validated public list/detail routes.
- Copy `modules/profiles/profile.routes.ts` for authenticated user-owned data.
- Copy `modules/recommendations/recommendation.service.ts` for unit-testable domain logic.

Avoid copying server data into Redux. If a value came from the API, begin with TanStack Query.
