# AGENTS.md

## Purpose

This file defines the coding rules that every AI coding agent must follow when working on this project.

The main goal is not only to produce working code. The code must also be:

- Easy for junior developers to read.
- Easy to understand without asking the AI again.
- Modular and maintainable.
- Consistent across the whole project.
- Safe to modify during a fast-moving hackathon.
- Written using clear naming instead of unnecessary abbreviations.

If existing project conventions conflict with this file, follow this file unless the team explicitly says otherwise.

---

# 1. Readability Comes First

## Rule

Prefer clear and descriptive code over short code.

Do not shorten names only to save characters.

### Bad

```ts
const usr = getUsr();
const cfg = loadCfg();

function calcTot(prc, qty) {
  return prc * qty;
}
```

### Good

```ts
const user = getUser();
const configuration = loadConfiguration();

function calculateTotalPrice(price, quantity) {
  return price * quantity;
}
```

## Requirements

The agent MUST:

- Use descriptive variable names.
- Use descriptive function names.
- Avoid unclear abbreviations.
- Avoid one-letter variable names except for universally understood local cases such as simple loop indexes.
- Prefer names that explain the meaning of the value rather than its data type.
- Keep naming style consistent across the project.

---

# 2. Functions Must Have a Clear Responsibility

Follow the **Single Responsibility Principle**, but do not apply it mechanically.

A function may perform several steps when those steps all belong to the **same workflow or responsibility**.

For example, a `createUser` function may reasonably validate the input, save the user, send a welcome email, and record analytics if the function remains short, readable, and easy to understand.

### Acceptable

```ts
async function createUser(userData) {
  validateUser(userData);

  const user = await saveUser(userData);

  await sendWelcomeEmail(user);
  trackUserRegistration(user);

  return user;
}
```

This function has one high-level responsibility: **coordinate the user creation workflow**.

Do NOT split functions just to make them smaller.

Split a function only when doing so clearly improves readability, maintainability, reuse, testing, or separation of concerns.

## Refactor When It Is Important

The agent SHOULD extract part of a function when one or more of these are true:

- A step contains substantial or tricky logic.
- The function becomes difficult to understand at a glance.
- A block of logic is reused in multiple places.
- A part deserves independent testing.
- A part is likely to change independently from the rest of the workflow.
- The function mixes unrelated responsibilities.
- The function contains deeply nested conditions or several different levels of abstraction.
- A side effect such as storage, networking, analytics, or notifications becomes complex enough to deserve isolation.

### Refactor Needed

```ts
async function createUser(userData) {
  // Dozens of lines of validation rules...
  // Several lines of normalization...
  // Build database payload...
  // Save the user...
  // Handle persistence-specific errors...
  // Build an email template...
  // Send the email with retry logic...
  // Build analytics metadata...
  // Record several analytics events...
  // More unrelated cleanup logic...
}
```

### Better

```ts
/**
 * Coordinates the user creation workflow.
 *
 * Complex responsibilities are delegated to focused functions so this
 * workflow stays easy to read and each important operation can be tested
 * independently.
 */
async function createUser(userData) {
  const validatedUserData = validateAndNormalizeUserData(userData);
  const user = await saveUser(validatedUserData);

  await sendWelcomeEmail(user);
  trackUserRegistration(user);

  return user;
}
```

## Agent Rule

The agent MUST:

- Keep each function centered around one understandable responsibility.
- Allow a function to coordinate several steps that belong to the same workflow.
- Avoid unnecessary decomposition into tiny functions.
- Extract logic when the extraction provides a clear readability, maintainability, testing, reuse, or architectural benefit.
- Prefer a high-level function that reads like a clear sequence of steps.
- Never refactor solely to satisfy an arbitrary function length target.

---

# 3. Automatically Refactor Large Components

React components must be modular.

The agent MUST NOT keep a large component as one file simply because it works.

If a component contains multiple independent responsibilities, extract them into smaller components.

Examples of separate responsibilities include:

- Header.
- Form.
- Search controls.
- Filter controls.
- List.
- List item.
- Empty state.
- Loading state.
- Error state.
- Modal.
- Action buttons.
- Data fetching logic.
- Complex state management.

### Example

Instead of:

```text
Dashboard.tsx
```

containing all dashboard logic and UI, prefer:

```text
Dashboard/
├── Dashboard.tsx
├── DashboardHeader.tsx
├── DashboardFilters.tsx
├── DashboardList.tsx
├── DashboardListItem.tsx
├── DashboardEmptyState.tsx
└── useDashboardData.ts
```

## Refactoring Trigger

The agent SHOULD consider splitting a component when:

- It has several visually independent sections.
- It contains several unrelated event handlers.
- It mixes data fetching, transformation, and presentation.
- It becomes difficult to understand without scrolling heavily.
- A section could reasonably be reused.
- Testing one part requires understanding unrelated code.

Do not split components into meaningless tiny files. Every extracted component must represent a real responsibility.

---

# 4. Follow SOLID Principles

Apply SOLID principles where they improve clarity and maintainability.

Especially enforce:

## Single Responsibility Principle

A function, class, hook, module, or component should have one primary reason to change.

## Open/Closed Principle

Prefer extending behavior through configuration, composition, or new modules instead of repeatedly modifying large conditional blocks.

## Liskov Substitution Principle

Implementations sharing an interface must behave consistently with that interface.

## Interface Segregation Principle

Do not create large interfaces that force consumers to depend on properties or methods they do not need.

## Dependency Inversion Principle

High-level business logic should not depend directly on low-level implementation details when a simple abstraction would improve maintainability.

Do not over-engineer the project only to demonstrate SOLID principles.

---

# 5. Every File Must Explain Its Purpose

Every source file created by the agent MUST begin with a short file-level comment explaining its purpose.

Use multiline comment syntax where supported.

### TypeScript / JavaScript

```ts
/**
 * Handles user profile settings.
 *
 * This module contains the UI and interaction logic for updating
 * the current user's profile information.
 */
```

### Python

```py
"""
Handles user profile settings.

This module contains the logic responsible for updating and
validating user profile information.
"""
```

The comment should explain WHY the file exists, not simply repeat the filename.

---

# 6. Comment Difficult Functions

Simple code does not need excessive comments.

Complex, tricky, non-obvious, algorithmic, or business-critical functions MUST have an explanatory comment directly above them.

The comment should explain:

- What the function does.
- Why the implementation is needed.
- Important assumptions.
- Important edge cases.
- Any non-obvious algorithm or transformation.
- Side effects when relevant.

### Example

```ts
/**
 * Merges locally modified records with records received from the server.
 *
 * Local edits take priority when both versions changed after the last
 * synchronization. Deleted server records are ignored when the local
 * record has unsynchronized changes.
 *
 * This function must stay deterministic because synchronization retries
 * may execute the same merge multiple times.
 */
function mergeSynchronizationRecords(...) {
  // implementation
}
```

Do not add comments such as:

```ts
// Increment count
count++;
```

Comments should explain reasoning, not obvious syntax.

---

# 7. Prefer Understandable Code Over Clever Code

Do not use clever shortcuts when a clearer implementation exists.

Avoid:

- Deeply nested ternaries.
- Large chained expressions.
- Excessive functional tricks.
- Unnecessary metaprogramming.
- Obscure language features.
- Dense one-line implementations.
- Premature abstractions.

Prefer intermediate variables when they make logic easier to understand.

### Bad

```ts
const result = users.filter(u => u.a && !u.d).map(u => ({...u, n: `${u.f} ${u.l}`})).sort((a,b) => a.n.localeCompare(b.n));
```

### Good

```ts
const activeUsers = users.filter((user) => {
  return user.isActive && !user.isDeleted;
});

const usersWithFullName = activeUsers.map((user) => {
  const fullName = `${user.firstName} ${user.lastName}`;

  return {
    ...user,
    fullName,
  };
});

const sortedUsers = usersWithFullName.sort((firstUser, secondUser) => {
  return firstUser.fullName.localeCompare(secondUser.fullName);
});
```

---

# 8. Naming Conventions

Names must communicate intent clearly.

## Variables

Use descriptive camelCase names.

### Good

```ts
currentUser
selectedDeck
maximumRetryCount
isAuthenticationRequired
```

### Avoid

```ts
usr
selD
maxR
authReq
```

## Functions

Use verbs that describe the action.

### Good

```ts
calculateInvoiceTotal()
validateEmailAddress()
fetchCurrentUser()
createStudySession()
handleFormSubmission()
```

### Avoid

```ts
calc()
doThing()
process()
handler()
manage()
```

Generic names are acceptable only when their context makes the purpose unambiguous.

## Boolean Variables

Prefer prefixes such as:

```text
is
has
can
should
was
needs
```

Examples:

```ts
isLoading
hasPermission
canEditDeck
shouldShowWarning
needsSynchronization
```

## React Components

Use PascalCase.

```text
UserProfile.tsx
StudySession.tsx
DeckCard.tsx
```

## Hooks

Custom React hooks MUST start with `use`.

```text
useCurrentUser.ts
useDeckSearch.ts
useStudySession.ts
```

## Utility Files

Use descriptive names.

```text
calculateStudyProgress.ts
formatReviewDate.ts
validateDeckName.ts
```

Do not create vague files such as:

```text
utils.ts
helpers.ts
common.ts
misc.ts
stuff.ts
```

unless the file is intentionally small and its responsibility is still obvious.

---

# 9. File and Folder Naming

Use one naming convention consistently within the project.

Recommended defaults:

- React components: `PascalCase.tsx`
- React hooks: `camelCase.ts`
- TypeScript utilities/services: `camelCase.ts`
- Tests: match the tested filename with `.test` or `.spec`
- Feature folders: `kebab-case` or existing project convention

Examples:

```text
components/
  UserProfile.tsx

hooks/
  useCurrentUser.ts

services/
  authenticationService.ts

utils/
  calculateStudyProgress.ts

features/
  study-session/
```

Do not introduce a different naming style without a strong reason.

---

# 10. Git Branch Naming

Use readable lowercase branch names with hyphens.

Preferred format:

```text
<type>/<short-description>
```

Allowed common types:

```text
feature/
fix/
bugfix/
refactor/
docs/
test/
chore/
hotfix/
```

Examples:

```text
feature/add-user-authentication
fix/mobile-navigation-overflow
refactor/split-dashboard-components
docs/update-project-setup
test/add-deck-service-tests
```

Avoid:

```text
newStuff
final-branch
mohamed-work
feature1
fix_bug
testBranch
myChanges
```

## Agent Responsibility

When the agent is given or detects a branch name that does not follow the project convention, it MUST warn the developer and suggest a corrected branch name.

Example:

```text
Warning: `AddLoginPage` does not follow the project branch naming convention.

Suggested branch:
feature/add-login-page
```

The agent should not silently rename or switch branches unless explicitly allowed to do so.

---

# 11. Git Commit Naming

Use clear commit messages.

Recommended format:

```text
<type>: <short description>
```

Examples:

```text
feat: add deck creation form
fix: prevent duplicate study sessions
refactor: split dashboard into smaller components
docs: explain local development setup
test: add validation tests for deck names
```

Common types:

```text
feat
fix
refactor
docs
test
chore
style
perf
```

Commit messages should describe what changed.

Avoid:

```text
update
changes
done
final
fix stuff
work
```

---

# 12. Keep Business Logic Away From UI When Possible

React components should mainly be responsible for rendering and user interaction.

Move substantial business logic into:

- Hooks.
- Services.
- Domain modules.
- Utility functions.
- State modules.

### Prefer

```text
components/
  StudySession.tsx

hooks/
  useStudySession.ts

services/
  studySessionService.ts

domain/
  calculateNextReview.ts
```

This makes logic easier to read, test, and reuse.

---

# 13. Avoid Large Files

The agent must actively watch for files that are becoming difficult to understand.

There is no strict line limit, because responsibility matters more than line count.

However, when a file contains several independent concepts, the agent SHOULD split it.

Before adding large amounts of code to an already complex file, first consider whether part of the file should be extracted.

---

# 14. Avoid Deep Nesting

Prefer early returns and guard clauses.

### Bad

```ts
function submitForm(user) {
  if (user) {
    if (user.isActive) {
      if (user.hasPermission) {
        // work
      }
    }
  }
}
```

### Good

```ts
function submitForm(user) {
  if (!user) {
    return;
  }

  if (!user.isActive) {
    return;
  }

  if (!user.hasPermission) {
    return;
  }

  // work
}
```

---

# 15. Error Handling Must Be Explicit

Do not silently ignore failures.

The agent MUST:

- Handle expected errors.
- Provide understandable error messages.
- Avoid empty `catch` blocks.
- Preserve useful debugging information.
- Separate user-facing errors from technical logging when appropriate.

### Bad

```ts
try {
  await saveData();
} catch {}
```

### Better

```ts
try {
  await saveData();
} catch (error) {
  logger.error("Failed to save user settings", error);

  throw new Error("Unable to save user settings.");
}
```

---

# 16. No Unexplained Magic Values

Avoid unexplained numbers and strings inside business logic.

### Bad

```ts
if (retryCount > 5) {
  return;
}
```

### Better

```ts
const MAXIMUM_RETRY_COUNT = 5;

if (retryCount > MAXIMUM_RETRY_COUNT) {
  return;
}
```

Use constants when the value has business meaning or may change.

---

# 17. Types Must Be Clear

When using TypeScript:

- Avoid `any` unless there is a strong reason.
- Prefer explicit domain types.
- Reuse shared types when they represent the same concept.
- Avoid enormous types that represent unrelated responsibilities.
- Give interfaces and types descriptive names.

### Bad

```ts
function save(data: any) {}
```

### Better

```ts
interface DeckCreationInput {
  name: string;
  description?: string;
}

function createDeck(deckInput: DeckCreationInput) {}
```

---

# 18. Do Not Duplicate Logic

Before creating a new helper, component, validation rule, or service function, check whether equivalent logic already exists.

If logic is duplicated in several places, extract the shared behavior only when the shared abstraction is clear.

Do not create abstractions too early for code that only happens once and is still simple.

---

# 19. Tests Should Be Readable

Tests must describe behavior clearly.

### Good

```ts
it("returns an error when the deck name is empty", () => {
  // test
});
```

Avoid:

```ts
it("works", () => {
  // test
});
```

Tests should follow the same readability and naming standards as production code.

---

# 20. Preserve Existing Behavior During Refactoring

When refactoring code:

- Do not change behavior unless requested.
- Keep public APIs stable when possible.
- Run available tests, type checks, lint checks, and builds.
- Mention any behavior that intentionally changed.
- Do not mix unrelated feature work into a refactor.

---

# 21. Validate Work Before Finishing

Before considering a task complete, the agent MUST run the relevant available checks.

Examples:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Use the commands that actually exist in the repository.

Do not invent scripts that are not defined.

If a check cannot be run, clearly say why.

---

# 22. Explain Significant Changes

After completing a task, the agent should provide a short summary containing:

- What changed.
- Why the change was made.
- Important files affected.
- Any important architectural decision.
- Any remaining concern or limitation.

The explanation should help a junior developer understand the change without reading the entire diff first.

---

# 23. Do Not Over-Engineer

This is a hackathon project.

Prefer the simplest architecture that remains clean and maintainable.

Do NOT introduce:

- Unnecessary design patterns.
- Extra abstraction layers without a clear benefit.
- Complex dependency injection systems for simple code.
- Large frameworks for small problems.
- Premature optimization.

The priority order is:

1. Correctness.
2. Readability.
3. Simplicity.
4. Maintainability.
5. Performance, unless performance is a real requirement.

---

# 24. Agent Self-Review Checklist

Before finishing any coding task, the agent MUST review the changes and ask:

- Are names understandable to a junior developer?
- Did I avoid unnecessary abbreviations?
- Does each function have one clear responsibility?
- Can any large component be divided into meaningful smaller components?
- Did I separate business logic from presentation where appropriate?
- Did I add a file-level purpose comment to every new source file?
- Did I explain complex or tricky functions?
- Did I avoid unnecessary comments on obvious code?
- Did I follow project naming conventions?
- Does the branch name follow the Git convention?
- Did I avoid duplicated logic?
- Did I handle errors explicitly?
- Did I avoid unnecessary complexity?
- Did I run available validation commands?
- Did I avoid unnecessary dependencies?
- Did I avoid unrelated changes?
- Did I solve warnings instead of hiding them?
- Did I remove dead code created by my change?
- Did I preserve accessibility and security basics?
- Can a junior developer understand and explain the important code I added?
- Can another developer understand what changed from my final explanation?

If the answer to any important item is "no", fix it before completing the task.


---

# 25. Understand Existing Code Before Modifying It

Before changing an existing feature, the agent SHOULD inspect the relevant surrounding code first.

This may include:

- Components.
- Hooks.
- Services.
- Types.
- State management.
- Validation logic.
- Tests.
- Existing utilities.

The agent MUST avoid introducing a new pattern before checking whether the project already has an established pattern for the same problem.

Prefer consistency with the existing architecture unless the existing approach is clearly harmful or the task explicitly requires a change.

---

# 26. Do Not Make Unrelated Changes

Keep every task focused.

The agent MUST NOT modify unrelated files, rename unrelated code, reformat large areas of the project, or perform opportunistic refactors unless they are necessary for the requested task.

If unrelated problems are discovered, mention them separately instead of silently fixing them.

This keeps pull requests easier to review and reduces merge conflicts during the hackathon.

---

# 27. Do Not Hide Errors or Warnings

Never make errors disappear without solving the underlying problem.

The agent MUST NOT use shortcuts such as:

```ts
// @ts-ignore
```

or unnecessary:

```ts
any
```

or disabled lint rules simply to make checks pass.

Exceptions are allowed only when there is a strong technical reason, and the reason MUST be explained in a nearby comment or in the final task summary.

Fix the actual type, lint, build, or runtime problem whenever reasonably possible.

---

# 28. Dependency Discipline

Do not add a new library just because it makes one implementation easier.

Before introducing a dependency, the agent MUST check whether:

- The project already contains a library that solves the problem.
- The functionality is simple enough to implement safely without another package.
- The dependency is actively maintained and appropriate for the project.
- The dependency adds significant bundle size or architectural complexity.

When adding a dependency, briefly explain why it is needed.

Never introduce multiple libraries that solve the same problem without a strong reason.

---

# 29. Remove Dead Code

After modifying code, remove obsolete code created by the change.

This includes:

- Unused imports.
- Unused variables.
- Unused functions.
- Old implementations that were replaced.
- Debug logging that is no longer needed.
- Commented-out blocks of old code.

Do not leave commented-out implementations as backups. Git already preserves history.

---

# 30. Keep UI, State, and Business Logic Understandable

In frontend code, make it easy for developers to recognize the role of each piece of code.

As a general guideline:

- Components render UI and handle direct user interaction.
- Hooks coordinate reusable React behavior and stateful workflows.
- Services communicate with APIs, storage, or external systems.
- Domain or utility functions contain reusable business calculations and transformations.

Do not force this structure when a feature is simple. Extract these layers when the separation makes the feature easier to understand or test.

---

# 31. Accessibility Is a Default Requirement

The agent MUST use accessible web patterns by default.

Prefer:

- Semantic HTML.
- Real `button` elements for actions.
- Real links for navigation.
- Proper form labels.
- Keyboard-accessible interactions.
- Visible focus behavior.
- Meaningful alternative text for informative images.
- ARIA attributes only when native HTML is insufficient.

Do not replace semantic HTML with generic `div` elements unless there is a valid reason.

---

# 32. Security Basics Are Mandatory

The agent MUST NOT:

- Hardcode passwords.
- Hardcode API secrets or private tokens.
- Commit `.env` secrets.
- Expose server-only credentials to frontend code.
- Trust unvalidated external input.
- Insert untrusted HTML without appropriate protection.

Use environment variables and the project's established secret-management approach where appropriate.

If a requested implementation creates an obvious security risk, warn the developer and use the safer implementation.

---

# 33. Do Not Rewrite Working Code Without a Reason

Do not rewrite code simply because the agent prefers another style.

A refactor should have a concrete benefit such as:

- Better readability.
- Reduced duplication.
- Easier testing.
- Clearer responsibilities.
- Better maintainability.
- Fixing a bug or architectural problem.

During a hackathon, stable and understandable code is usually more valuable than stylistic perfection.

---

# 34. Important Architecture Decisions Must Be Explained

When the agent makes a meaningful architectural decision, briefly explain it.

Examples include:

- Introducing a new service layer.
- Moving state ownership.
- Creating a reusable abstraction.
- Choosing a new data structure.
- Adding a significant dependency.
- Changing how data flows through the application.

The explanation should be short and understandable to junior developers.

---

# 35. Code Must Be Explainable by the Team

This is one of the highest-priority rules for this project.

The AI is not only producing code for the computer. It is producing code that the hackathon team must be able to read, debug, modify, and explain.

The agent SHOULD prefer a slightly longer but understandable implementation over a shorter clever implementation.

If an implementation is technically correct but unnecessarily difficult for a junior developer to explain, simplify it.

A developer reading an important function should be able to answer:

1. What does this function do?
2. Why does it exist?
3. What data does it receive?
4. What does it return or change?
5. What other important functions or services does it call?
6. What could cause it to fail?

Complexity is acceptable when the problem genuinely requires it, but the code and comments must make that complexity understandable.

---

# 36. Rule Priority

When making decisions, follow this priority:

1. Explicit developer request.
2. This `AGENTS.md`.
3. Existing project architecture and conventions.
4. Framework and language best practices.
5. Agent preference.

When unsure between a clever implementation and an understandable implementation, choose the understandable implementation.
