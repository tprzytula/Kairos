# iOS SwiftUI Rewrite — Planning Docs

These documents plan the native iOS SwiftUI app that replaces the React PWA frontend. The backend (AWS Lambda + DynamoDB) stays unchanged except for one Cognito callback URL addition.

## How to use these docs

Every phase agent should load, in order:

1. **`PROGRESS.md`** — current status of every phase, active work, blockers, deviations. **Read this first** to know what's done, what's in flight, and what you can pick up. Update it as you work (see the protocol at the bottom of that file).
2. **`00-overview.md`** — architecture, project structure, React→SwiftUI concept map
3. **`01-cross-cutting.md`** — rules that apply to every phase (auth scoping, error handling, `isPrivate` mapping, date formats, `EntityStore` protocol, shared-file coordination, testing, verification)
4. **The phase file** for the work being done

Reference as needed:

- **`api-reference.md`** — endpoint tables, header rules, API quirks
- **`models.md`** — verified `Codable` structs and enums

**Rules in `01-cross-cutting.md` are the single source of truth.** Do not copy them into phase files — link, don't duplicate.

## Phase dependency graph

```
Phase 0 (Scaffold)
  └── Phase 1 (Auth + Networking)
        └── Phase 2 (Projects + Core Wiring)
              ├── Phase 3a (Shared Views) ────────────────────┐
              │     └── Phase 3b (Shops)                      │
              │           └── Phase 3c (Grocery Store/Views)  │
              │                 └── Phase 3d (Grocery Forms)  │
              ├── Phase 4 (Planner / To-Do)      ── needs 3a  │
              ├── Phase 5 (Recipes + Meal Plans) ── needs 3a  │
              ├── Phase 7a (Adventures)          ── needs 3a  │
              ├── Phase 7b (Birthdays)           ── needs 3a  │
              ├── Phase 7c (Noise Tracking)      ── needs 3a  │
              ├── Phase 7d (Office Attendance)   ── needs 3a  │
              ├── Phase 8a (Project Members)                  │
              └── Phase 9 (Push Notifications)                │
                                                              │
Phase 6 (Home Dashboard) ── needs 3b, 4, 5, 7a–d ─────────────┘
Phase 8b (Polish)        ── needs all above
Phase 10 (App Store)     ── needs all above
```

**Parallelizable after Phase 3a completes**: 3b, 4, 5, 7a, 7b, 7c, 7d, 8a, 9.

## Phase index

- [Phase 0 — Scaffold](phase-0-scaffold.md)
- [Phase 1 — Auth + Networking](phase-1-auth-networking.md)
- [Phase 2 — Projects + Core Wiring](phase-2-projects.md)
- [Phase 3a — Shared Views](phase-3a-shared-views.md) *(prerequisite for all domain phases)*
- [Phase 3b — Shops](phase-3b-shops.md)
- [Phase 3c — Grocery Store + List Views](phase-3c-grocery-store.md)
- [Phase 3d — Grocery Item Forms](phase-3d-grocery-forms.md)
- [Phase 4 — Planner / To-Do](phase-4-planner.md)
- [Phase 5 — Recipes + Meal Plans](phase-5-recipes-meal-plans.md)
- [Phase 6 — Home Dashboard](phase-6-home-dashboard.md)
- [Phase 7a — Adventures](phase-7a-adventures.md)
- [Phase 7b — Birthdays](phase-7b-birthdays.md)
- [Phase 7c — Noise Tracking](phase-7c-noise-tracking.md)
- [Phase 7d — Office Attendance](phase-7d-office-attendance.md)
- [Phase 8a — Project Members](phase-8a-project-members.md)
- [Phase 8b — Polish](phase-8b-polish.md)
- [Phase 9 — Push Notifications](phase-9-push-notifications.md)
- [Phase 10 — App Store Prep](phase-10-app-store.md)

## Critical files in the monorepo to reference during implementation

| Purpose | File Path |
|---|---|
| Shared type definitions | `packages/shared/types/*.ts` |
| Shared enum definitions | `packages/shared/enums/*.ts` |
| Web-only enums (grocery, planner) | `packages/web/src/enums/*.ts` |
| API client factory pattern | `packages/web/src/api/index.ts` |
| API header construction | `packages/web/src/utils/api.ts` |
| OIDC configuration | `packages/web/src/config/oidc.ts` |
| Cognito Terraform (callback + logout URLs) | `packages/infra/modules/cognito/main.tf` (lines ~94–103) |
| Provider patterns (reference impl) | `packages/web/src/providers/ShopProvider/index.tsx` |
| Generic CRUD hook | `packages/web/src/hooks/useEntityCrud/index.ts` |
| Category matcher logic | `packages/web/src/utils/grocery/categoryMatcher.ts` |
| Grocery category grouping hook | `packages/web/src/hooks/useGroceryCategories/index.ts` |
| Home dashboard aggregation | `packages/web/src/hooks/useHomeData/index.ts` |
| AppState (ephemeral UI state) | `packages/web/src/providers/AppStateProvider/index.tsx` |
| Grocery item defaults type | `packages/web/src/api/groceryList/retrieve/types.ts` |
| Project invite info type | `packages/web/src/types/project.ts` |
