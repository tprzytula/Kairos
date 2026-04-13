# Phase 8b — Polish Pass

**Goal**: Feature-complete with polished UX.

**Depends on**: ALL previous phases.

**Read first**: `00-overview.md`, `01-cross-cutting.md`.

## Deliverables

- Haptic feedback on: item completion (todo checked, grocery purchased), successful create/delete
- `.refreshable { }` on all list views (verify already present from domain phases)
- Empty states for all lists (verify `EmptyStateView` used consistently)
- Loading skeletons on first load (verify `LoadingView` used consistently)
- Error retry: tap-to-retry on `ErrorView` for all fetch failures
- `AlertBanner` overlay driven by `AppStateStore.alerts` for success/error toasts

## Acceptance criteria

All lists have pull-to-refresh. All empty states show helpful messages. All first-load states show loading indicators. Error states show retry button. Haptic feedback fires on key interactions. Toast notifications appear for mutations.
