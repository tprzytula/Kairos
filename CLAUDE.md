# Kairos — CLAUDE.md

Kairos is a full-stack, serverless, multi-tenant productivity PWA running on AWS. This file documents the codebase structure, development workflows, and conventions for AI assistants.

---

## Repository Overview

**Yarn v1 monorepo** with four packages:

| Package | Purpose |
|---|---|
| `packages/web` | React 19 PWA frontend |
| `packages/lambdas` | 54+ AWS Lambda functions (Node 20) |
| `packages/infra` | Terraform IaC (AWS infrastructure) |
| `packages/assets` | SVG icons + PWA manifest |

**License:** AGPL-3.0
**Author:** Tomasz Przytula

---

## Tech Stack

### Frontend (`packages/web`)
- **React** 19 + React Router 7 + TypeScript 5.8 (strict)
- **Build:** Vite 8 (+ separate service worker build via `vite.config.sw.ts`)
- **Testing:** Vitest 4 + React Testing Library + happy-dom
- **UI:** Material-UI 7 (MUI) + Emotion
- **State:** React Context providers + TanStack React Query 5
- **Auth:** OIDC via `react-oidc-context` (AWS Cognito, eu-west-2)
- **Lint:** Oxlint; **Format:** Prettier (100 chars, 2-space, single quotes, trailing commas)

### Backend (`packages/lambdas`)
- **Runtime:** Node.js 20 (AWS Lambda), TypeScript 5.8 (strict)
- **Bundle:** esbuild (minified + sourcemaps)
- **Testing:** Vitest 4 (Node environment)
- **AWS SDK:** `@aws-sdk/client-dynamodb` v3 + `@aws-sdk/lib-dynamodb`
- **Workspace manager:** Lerna 8
- **Lint/Format:** Oxlint + Prettier (same config as web)

### Infrastructure (`packages/infra`)
- **Tool:** Terraform
- **Region:** eu-west-2 (London)
- **Services:** API Gateway, Cognito, DynamoDB, Lambda, S3, CloudFront, SNS, IAM

---

## Common Commands

```bash
# From repo root
yarn build             # Build web + lambdas
yarn test              # Run all tests concurrently
yarn lint              # Lint web + lambdas
yarn prettier          # Check formatting

# Web
cd packages/web
yarn start             # Dev server at http://localhost:1234
yarn build             # Production build + version injection
yarn test              # Vitest (TZ=Europe/London)
yarn test:watch        # Watch mode
yarn test:coverage     # Coverage to .coverage/
yarn lint              # Oxlint

# Lambdas
cd packages/lambdas
yarn build             # esbuild bundle + zip
yarn test              # Vitest (Node env)
yarn test:watch        # Watch mode
yarn lint              # Oxlint
```

---

## Directory Structure

### Web (`packages/web/src/`)

```
src/
├── api/               # API clients grouped by domain (adventures, groceryList, etc.)
├── components/        # 65+ React components, each in own directory (see below)
├── config/            # App config (oidc.ts — Cognito settings)
├── constants/         # App-wide constants
├── enums/             # TypeScript enums
├── hooks/             # 13+ custom hooks (useDragToClose, usePushNotifications, etc.)
├── layout/            # Layout wrapper components
├── providers/         # 11 Context providers (one per domain)
├── routes/            # 11 route components
├── types/             # Shared TypeScript types
├── utils/             # Utility functions organized by domain
├── App.tsx            # Root component
├── index.tsx          # Entry point — provider nesting chain
├── sw.ts              # Service Worker (offline + push notifications)
└── theme.ts           # MUI theme configuration
```

### Lambdas (`packages/lambdas/`)

```
packages/lambdas/
├── sources/           # 54 Lambda functions (snake_case directories)
├── libs/
│   ├── types/         # @kairos-lambdas-libs/types — core TS definitions
│   ├── dynamodb/      # @kairos-lambdas-libs/dynamodb — DynamoDB client wrapper
│   ├── middleware/    # @kairos-lambdas-libs/middleware — auth + context extraction
│   └── response/      # @kairos-lambdas-libs/response — standardized response factory
├── tsconfig.json
├── lerna.json
└── vitest.config.ts
```

---

## File & Naming Conventions

### React Components (MANDATORY structure)

Every component lives in its own PascalCase directory with exactly these files:

```
components/
  MyComponent/
    index.tsx          # Functional component
    index.test.tsx     # BDD-style unit tests
    index.styled.tsx   # Emotion/MUI styled components
    types.ts           # Props and local type interfaces
```

### Lambda Functions

Each Lambda lives in its own snake_case directory:

```
sources/
  add_todo_item/
    index.ts           # Handler wrapped with middleware()
    index.test.ts      # Unit tests (AWS SDK mocked)
    types.ts           # Request/response interfaces
    body/              # Request body validation
    package.json       # Workspace metadata
```

### Other Naming Rules
- Lambda directories: `snake_case`
- Test files: `*.test.tsx` / `*.test.ts`
- Styled component files: `index.styled.tsx`
- Type files: `types.ts`

---

## TypeScript Standards (CRITICAL)

- **Strict mode** is enabled everywhere — never disable it
- **NEVER use `as` type assertions** in source/logic code — fix type definitions instead
- Use `unknown` instead of `any`
- Define **explicit return types** for all functions
- If types don't satisfy requirements, update the type definitions
- `as` may appear in unit tests only as a last resort; prefer type guards

---

## Testing Standards (MANDATORY)

**Every commit must have passing tests — no exceptions.**

### Style: BDD (Behavior-Driven Development)

```typescript
// Web example
describe('Given the Alert component', () => {
  it('should render the description', () => {
    // Given
    renderComponent({ description: 'alert description' });

    // When / Then
    expect(screen.getByText('alert description')).toBeVisible();
  });
});

// Lambda example
describe('Given the add_todo_item lambda handler', () => {
  it('should require authentication first', async () => {
    const result = await runHandler({ body: null });
    expect(result.statusCode).toBe(401);
  });
});
```

### Rules
- Write tests **immediately** after implementing each feature — do not accumulate failing tests
- Run tests after every change
- Mock AWS SDK calls in Lambda tests using `vi.mock`
- Lambda tests use Node environment; web tests use happy-dom
- Web tests run with `TZ=Europe/London` (important for date logic)

---

## API Development (MANDATORY)

### Contract-First Approach
- OpenAPI 3.0 specs live in `packages/infra/modules/api_gateway/openapi/` (12 resource files)
- **Always consult the OpenAPI contract** before writing or modifying Lambda handlers or web API clients
- **If behavior needs to change, update the OpenAPI contract FIRST**, then implement
- Validate request/response payloads against the schema

### Standards
- All Lambda responses use `createResponse()` from `@kairos-lambdas-libs/response` — this adds CORS headers automatically
- Multi-tenant operations require the `X-Project-ID` request header
- Follow RESTful conventions and use proper HTTP status codes

---

## Multi-Tenancy Model

- **Projects** are the unit of data isolation
- **Personal Project:** auto-created per user, ID = user's Cognito `sub`
- **Shared Projects:** users can join via QR code or link
- Every DynamoDB item has a `projectId` partition key
- The middleware library extracts `userId`, `projectId`, and user claims from the Cognito JWT on every request

---

## State Management (Web)

| Scope | Approach |
|---|---|
| Single component | `useState` (preferred) |
| Cross-component (domain) | React Context Provider (11 domain providers) |
| Server/async data | TanStack React Query (caching, refetch) |

Provider nesting order (outermost → innermost):
`QueryClientProvider` → `ThemeProvider` → `AuthProvider` → `ProjectProvider` → `AppStateProvider` → `RecipeProvider` → `BrowserRouter`

---

## Infrastructure Rules (CRITICAL)

- **NEVER run `terraform plan` or any `terraform` command locally**
- All infrastructure provisioning is handled automatically by GitHub Actions on push to `master`
- Only modify `.tf` files; CI/CD applies them

---

## Git Workflow

- **NEVER commit or push without explicit user permission**
- **NEVER push directly to `master` without explicit approval**
- Use **conventional commits**: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`, etc.
- Run all tests before committing (web + lambdas)
- Verify formatting with `yarn prettier` before committing

### Pre-Commit Checklist (NEVER SKIP)
1. Get explicit user permission to commit
2. Run `cd packages/web && yarn test` — all must pass
3. Run `cd packages/lambdas && yarn test` — all must pass
4. Verify `yarn prettier` passes
5. Verify OpenAPI contracts are updated if API behavior changed
6. Write a descriptive conventional commit message
7. Request approval before pushing to `master`

---

## CI/CD (GitHub Actions)

| Workflow | Trigger | Steps |
|---|---|---|
| `test-web.yml` | Push to `packages/web/**` | Install → Lint → Build → Test |
| `test-lambdas.yml` | Push to `packages/lambdas/**` | Install → Lint → Build → Test |
| `publish-web.yml` | Push to `master` on `packages/web/**` | Build → Version bump → S3 sync → CloudFront invalidation |
| `publish-lambdas.yml` | Push to `master` on `packages/lambdas/**` | Build → Upload to S3 Lambda bucket |
| `run-migrations.yml` | Manual / push | DynamoDB migration orchestration |

- AWS authentication uses OIDC (no long-lived credentials stored)
- Version is date-based: `YYYY.MM.DD.HHMM`
- Version bumps are committed with `[skip ci]` to avoid loops

---

## DynamoDB Schema

13 tables, all with `projectId` as partition key for multi-tenant isolation:

`grocery_list`, `todo_list`, `recipes`, `meal_plans`, `birthdays`, `noise_tracking`, `shops`, `projects`, `project_members`, `user_preferences`, `push_subscriptions`, `adventures`, `migrations`

Use the `@kairos-lambdas-libs/dynamodb` wrapper — do not instantiate the AWS SDK client directly in Lambda handlers.

---

## Security

- Never commit sensitive data (API keys, secrets, credentials)
- Validate all inputs on both client and server side
- Authentication is enforced by the middleware lib on every Lambda handler
- Use proper AWS security best practices (least privilege IAM)
- Input validation uses OpenAPI schema definitions at the API Gateway layer

---

## Code Quality Principles

- Write self-documenting code — clear variable and function names over comments
- Keep functions small and single-responsibility
- Implement proper loading and error states in React components
- Use `React.memo()` only for demonstrably expensive components
- Implement proper cleanup in `useEffect` hooks
- Optimize Lambda cold starts by minimizing imported dependencies
- Use `@kairos-lambdas-libs/response` for all Lambda responses (ensures consistent CORS + error format)
