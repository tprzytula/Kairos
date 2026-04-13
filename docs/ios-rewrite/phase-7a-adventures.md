# Phase 7a — Adventures

**Goal**: Adventure CRUD with image upload.

**Depends on**: Phase 3a. Runs in parallel with 3b–3d, 4, 5, 7b–d, 8a.

**Read first**: `00-overview.md`, `01-cross-cutting.md`.
**Reference as needed**: `api-reference.md` (Adventures section), `models.md` (`Adventure`).

## Deliverables

- **Store**: `AdventureStore` — conforms to `EntityStore` protocol. Update via `POST /adventures/{id}`. Image upload via `/adventures/upload-url`.
- **Views**:
  - `AdventureListView` — sorted by date
  - `AddAdventureView` — name, date range, time range, location, notes, image
  - `EditAdventureView`
- **Tests**: `AdventureStoreTests`

## Acceptance criteria

List shows adventures sorted by date. Can add/edit/delete. Date/time pickers work. Image upload works. Swipe to delete. All tests pass.
