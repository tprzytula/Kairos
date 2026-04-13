# Phase 3a — Shared Views

**Goal**: Reusable view components available for all domain phases.

**Depends on**: Phase 2.

**Prerequisite for all domain phases (3b–3d, 4, 5, 6, 7a–d, 8).**

**Read first**: `00-overview.md`, `01-cross-cutting.md`.

## Deliverables

- `LoadingView` — standard loading indicator
- `ErrorView` — tap-to-retry error state
- `EmptyStateView` — empty state with customizable message/icon
- `SwipeActionRow` — reusable swipe-to-delete/edit row (wraps `.swipeActions`)
- `AsyncS3Image` — loads images from S3 `imagePath`
- `SearchBar` — reusable search input
- `AlertBanner` — toast notification display driven by `AppStateStore.alerts`
- `HapticFeedback` utility

## Acceptance criteria

Each shared view renders correctly in Xcode previews. No domain-specific logic — purely presentational. All views accept configuration via parameters.
