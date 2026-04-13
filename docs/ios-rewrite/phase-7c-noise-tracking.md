# Phase 7c — Noise Tracking

**Goal**: Noise event logging with stats.

**Depends on**: Phase 3a. Runs in parallel with 3b–3d, 4, 5, 7a–b, 7d, 8a.

**Read first**: `00-overview.md`, `01-cross-cutting.md`.
**Reference as needed**: `api-reference.md` (Noise Tracking section), `models.md` (`NoiseTrackingItem`).

## Deliverables

- **Store**: `NoiseTrackingStore` (does NOT conform to `EntityStore` — no update endpoint, delete by timestamp). Add sends `{ timestamp }`, delete path is `/noise_tracking/items/{timestamp}` — uses **timestamp as identifier, NOT id**.
- **Views**:
  - `NoiseTrackingView` — log button + event list
  - `NoiseStatsView` — frequency charts/stats
- **Tests**: `NoiseTrackingStoreTests`

## Phase-specific API notes

- Path uses **underscores** (`noise_tracking`).
- Delete uses `{timestamp}` (Unix ms number) as path param, not `{id}`.

## Acceptance criteria

User taps button to log noise event (creates item with current Unix ms timestamp). List shows events in reverse chronological order. Stats view shows frequency data. Can delete events. All tests pass.
