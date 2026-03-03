<div align="center">
  <img src="packages/assets/webManifest/96x96.png" alt="Kairos Logo" width="96" height="96">
  <h1>Kairos</h1>
  <p>A cloud-native, serverless productivity platform for managing grocery lists, todos, and shared projects — built as a Progressive Web App.</p>
</div>

---

## Overview

Kairos is a full-stack serverless application running on AWS. It provides:

- **Grocery list management** — add, categorise, and organise items by shop
- **Todo list management** — track tasks with push notification reminders
- **Noise tracking** — log and review environmental noise readings
- **Shop management** — define and manage shopping locations
- **Shared projects** — invite others to collaborate on lists in real time
- **Progressive Web App** — installable, offline-capable, with push notifications

Authentication is handled via AWS Cognito with Google OAuth support.

---

## Project Structure

This is a Yarn v1 monorepo with four packages:

```
packages/
├── web/        # React 19 PWA — frontend application
├── lambdas/    # AWS Lambda functions — backend business logic
├── infra/      # Terraform — AWS infrastructure as code
└── assets/     # SVG icons and PWA manifest
```

### `packages/web`

React 19 single-page application built with:

| Tool | Version |
|------|---------|
| React + React Router | 19 / 7 |
| Material-UI | 7 |
| TypeScript | 5.8 |
| Parcel (build) | 2 |
| Jest + React Testing Library | 30 |
| Oxlint | 1.51 |
| Prettier | 3.5 |

Includes a compiled service worker (`sw.ts`) for PWA offline support and push notification handling.

### `packages/lambdas`

29 AWS Lambda handlers written in TypeScript, bundled with esbuild for Node.js 20. Organised as a Lerna workspace with four internal shared libraries:

| Library | Purpose |
|---------|---------|
| `@kairos-lambdas-libs/types` | Core TypeScript types |
| `@kairos-lambdas-libs/dynamodb` | DynamoDB client wrapper |
| `@kairos-lambdas-libs/middleware` | Cognito auth token parsing |
| `@kairos-lambdas-libs/response` | Standardised API response formatter |

### `packages/infra`

Terraform configuration deploying to **eu-west-2 (London)** with eight modules:

| Module | Resources |
|--------|----------|
| `api_gateway` | REST API with OpenAPI specs and Cognito authoriser |
| `cognito` | User Pool, Google OAuth identity provider |
| `dynamodb` | 10 tables with GSIs for multi-tenant queries |
| `lambda` | Function definitions and IAM execution roles |
| `s3` | Web asset bucket, lambda dist bucket, CloudFront distribution |
| `sns` | Topic for todo push notifications |
| `policies` | IAM policies for Lambda ↔ AWS service access |
| `assets` | Static asset deployment |

OpenAPI 3.0 specs live in `packages/infra/modules/api_gateway/openapi/` and define the contracts for all eight resource groups.

### `packages/assets`

83+ SVG icons and the PWA web manifest configuration.

---

## Prerequisites

- **Node.js** v20+
- **Yarn** v1.22+
- **Terraform** (for infrastructure changes)
- **AWS account** (for deployment)

---

## Getting Started

### Install dependencies

```bash
git clone https://github.com/tprzytula/Kairos.git
cd Kairos
yarn install
```

### Run the web app locally

```bash
cd packages/web
yarn start
# → http://localhost:1234
```

The app connects to the production API and Cognito by default. OIDC config is in `packages/web/src/config/oidc.ts`.

---

## Scripts

### Root

```bash
yarn build            # Build web + lambdas
yarn build:web        # Build web only
yarn build:lambdas    # Build lambdas only
yarn test             # Run all tests
yarn test:web         # Web tests only
yarn test:lambdas     # Lambda tests only
yarn lint             # Lint all packages
yarn prettier         # Check formatting across all packages
```

### Web (`packages/web`)

```bash
yarn start            # Parcel dev server
yarn build            # Production build (app + service worker + version injection)
yarn test             # Jest (TZ=Europe/London)
yarn test:watch       # Jest watch mode
yarn lint             # Oxlint
yarn prettier:fix     # Auto-fix formatting
```

### Lambdas (`packages/lambdas`)

```bash
yarn build            # Bundle with esbuild + zip each function
yarn bundle           # esbuild only
yarn package          # Zip only
yarn test             # Jest
yarn test:watch       # Jest watch mode
yarn lint             # Oxlint
yarn prettier         # Prettier (writes files)
```

### Infra (`packages/infra`)

```bash
yarn apply            # Build lambdas + terraform apply
yarn build            # Build lambdas (validation only)
```

---

## Architecture

### Multi-tenancy

Every user gets a personal project (ID = their Cognito user ID). Projects can be shared with other users via invite codes. All DynamoDB tables use `projectId` as the partition key or have a GSI on `project-id` for data isolation. All API requests require an `X-Project-ID` header, which the Lambda middleware validates against the authenticated user's Cognito token.

### DynamoDB tables

| Table | Description |
|-------|-------------|
| `grocery_list` | Grocery items, scoped by project |
| `grocery_items_defaults` | Pre-populated default items |
| `todo_list` | Todo tasks, scoped by project |
| `noise_tracking` | Noise readings, scoped by project |
| `projects` | Project definitions |
| `project_members` | User ↔ project membership |
| `user_preferences` | Per-user settings |
| `push_subscriptions` | Web push notification subscriptions |
| `shops` | Shop definitions, scoped by project |
| `migrations` | Database migration tracking |

### Lambda functions (29)

| Group | Functions |
|-------|----------|
| Grocery list | `add`, `get`, `get_defaults`, `update`, `delete`, `delete_bulk` |
| Todo list | `add`, `get`, `update`, `update_bulk`, `delete` |
| Noise tracking | `add`, `get`, `delete` |
| Shops | `add`, `get`, `update`, `delete` |
| Projects | `create`, `get_user_projects`, `join`, `get_invite_info` |
| User preferences | `get`, `update` |
| Push notifications | `save_subscription`, `delete_subscription`, `send_notifications` |
| Infrastructure | `db_migrations` |

### Push notifications

Todo updates in shared projects trigger an SNS message. The `send_todo_notifications` Lambda subscribes to the SNS topic and fans out web push messages to all subscribed project members.

---

## Testing

Tests use Jest with BDD-style conventions (`Given / When / Then`).

```bash
# All tests from root
yarn test

# Or per package
yarn test:web
yarn test:lambdas
```

Web tests run in a jsdom environment with `TZ=Europe/London`. Lambda tests run in a Node environment. Coverage is collected to `.coverage/` in each package.

**All tests must pass before committing.** See [Contributing](#contributing).

---

## Deployment

### CI/CD (GitHub Actions)

| Workflow | Trigger | Action |
|----------|---------|--------|
| `test-web.yml` | Push touching `packages/web/**` | Lint → build → test |
| `test-lambdas.yml` | Push touching `packages/lambdas/**` | Lint → build → test |
| `publish-web.yml` | Push to `master` touching `packages/web/**` | Build → S3 sync → CloudFront invalidation |
| `publish-lambdas.yml` | Push to `master` touching `packages/lambdas/**` | Build → S3 sync |

AWS authentication uses GitHub Actions OIDC (no long-lived credentials). Each publish workflow assumes an IAM role via `aws-actions/configure-aws-credentials`.

The web publish workflow auto-injects a date-based version (`YYYY.MM.DD.HHMM`) into `dist/version.json` and commits the version bump to `package.json` with `[skip ci]`.

### Manual infrastructure deployment

```bash
cd packages/infra
terraform init
terraform plan
terraform apply
```

Terraform state is stored in an S3 backend with DynamoDB locking.

---

## Contributing

### Code style

- **TypeScript:** explicit return types, `unknown` over `any`, no `as` type assertions
- **Formatting:** Prettier (100 char line width, 2-space indent, trailing commas) — run `yarn prettier:fix`
- **Linting:** Oxlint — run `yarn lint`
- **API changes:** update OpenAPI specs in `packages/infra/modules/api_gateway/openapi/` before implementation

### Component structure

```
components/ComponentName/
  index.tsx           # Component implementation
  index.test.tsx      # BDD-style unit tests
  index.styled.tsx    # Styled components (MUI/Emotion)
  types.ts            # TypeScript interfaces
```

### Commit conventions

Use conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, etc.

### Before every commit

1. Run `yarn test` — all tests must pass
2. Run `yarn lint` — no lint errors
3. Run `yarn prettier` — no formatting issues

---

## License

[GNU Affero General Public License v3.0 (AGPL-3.0)](LICENSE)

You may use, modify, and distribute this software under the terms of the AGPL-3.0. Any network-accessible deployment of a modified version must make the source code available.

---

## Author

**Tomasz Przytula**
