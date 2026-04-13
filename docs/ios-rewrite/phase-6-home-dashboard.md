# Phase 6 — Home Dashboard

**Goal**: Aggregated dashboard with all domain data.

**Depends on**: Phases 3b, 4, 5, 7a–d (all domain stores must exist).

**Read first**: `00-overview.md`, `01-cross-cutting.md`.
**Reference**: `packages/web/src/hooks/useHomeData/index.ts` for the aggregation logic to port.

## Deliverables

- **Views**:
  - `HomeView`
  - `HomeGrocerySection` — pending items count per shop
  - `HomeTodoSection` — overdue + upcoming
  - `HomeNoiseSection` — recent count + stats
  - `HomeBirthdaySection` — upcoming birthdays
  - `HomeAdventureSection` — upcoming adventures
  - `HomeMealPlanSection` — today's meals
- **Logic**: Port `useHomeData` aggregation from `packages/web/src/hooks/useHomeData/index.ts` — pending item counts, upcoming items, stats.

## Implementation notes

- Each section reads from its domain store (injected via `.environment()`).
- Sections must gracefully handle empty data.
- Build sections incrementally as domain stores become available — if a domain phase is delayed, its home section can show empty state.

## Acceptance criteria

Dashboard shows summary cards for each domain. Grocery section shows total pending items. Todo section shows overdue count. Birthday section shows next upcoming. Tapping a section navigates to its full domain view. All sections show empty states gracefully. Pull-to-refresh reloads all domains.
