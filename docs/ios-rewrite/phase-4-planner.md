# Phase 4 — Planner / To-Do

**Goal**: Full task management with 3 view modes.

**Depends on**: Phase 3a (shared views). Runs in parallel with 3b–3d, 5, 7a–d, 8a.

**Read first**: `00-overview.md`, `01-cross-cutting.md`.
**Reference as needed**: `api-reference.md` (To-Do Items section), `models.md` (`TodoItem`, `TodoStep`, `PlannerViewMode`).

## Deliverables

- **Store**: `PlannerStore`. Single update via `PATCH /todo_list/items/{id}`. Batch `isDone` toggle via `POST /todo_list/items` with `{ items: [{ id, isDone }] }`. Reads `selectedTodoItems` and `selectedCalendarDate` from `AppStateStore`.
- **Views**:
  - `PlannerView` — segmented control for 3 modes
  - `PlannerCalendarView` — highlights dates with items; tapping date sets `selectedCalendarDate`
  - `PlannerWeeklyView` — groups by week
  - `PlannerGroupedView` — separates done/undone
  - `TodoItemRow` — with steps expansion
  - `TodoStepRow`
  - `AddTodoItemView` — name, description, due date picker
  - `EditTodoItemView`
- **Tests**: `PlannerStoreTests` — CRUD, batch toggle, date filtering.

## Phase-specific API notes

- `dueDate` is Unix timestamp in **milliseconds** (Int). See `01-cross-cutting.md` → Date Format Conventions.
- Batch toggle uses `POST /todo_list/items` with `{ items: [{ id, isDone }] }`.
- Delete uses `DELETE /todo_list/items` with `{ items: [TodoItem] }` (body, not path param).

## Acceptance criteria

Planner shows 3 view modes via segmented control. Calendar view highlights dates that have items; tapping a date shows that day's items. Weekly view groups items by week. Grouped view separates done/undone. Can add/edit/delete items. Swipe to delete. Tap checkbox toggles `isDone` (batch toggle for multi-select). Steps expand inline. All tests pass.
