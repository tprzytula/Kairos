# Phase 2 — Projects + Core Wiring

**Goal**: User can see/switch projects and access user menu.

**Depends on**: Phase 1.

**Read first**: `00-overview.md`, `01-cross-cutting.md`.
**Reference as needed**: `api-reference.md` (Projects section), `models.md` (`Project`, `UserPreferences`).

## Deliverables

- **Stores**:
  - `ProjectStore`: fetch projects, switch active project, user preferences with `currentProjectId`. Uses user-scoped calls — NO `X-Project-ID` header (except for members endpoint).
  - `AppStateStore`: alerts, `purchasedItems`, `selectedTodoItems`, `selectedCalendarDate`. See `01-cross-cutting.md` → AppState Ephemeral UI State.
- **DI**: `DependencyContainer` wiring `AuthStore`, `ProjectStore`, `AppStateStore`. Follow the append-only pattern in `01-cross-cutting.md` → Shared File Coordination.
- **Views**:
  - `ProjectSwitcherView`: list projects, tap to switch
  - `UserMenuView`: project info, switch project, logout button
- **Tests**: `ProjectStoreTests` — fetch projects, switch project updates preferences, user-scoped API calls have no `X-Project-ID`.

## Acceptance criteria

After login, app fetches user's projects and sets the active project. User menu shows current project name. Switching projects updates `UserPreferences.currentProjectId` via API. Subsequent domain fetches use the new project ID. All tests pass.
