# Phase 7b — Birthdays

**Goal**: Birthday CRUD.

**Depends on**: Phase 3a. Runs in parallel with 3b–3d, 4, 5, 7a, 7c–d, 8a.

**Read first**: `00-overview.md`, `01-cross-cutting.md`.
**Reference as needed**: `api-reference.md` (Birthdays section), `models.md` (`Birthday`).

## Deliverables

- **Store**: `BirthdayStore` — conforms to `EntityStore` protocol. Update via `PATCH /birthdays/items/{id}`.
- **Views**:
  - `BirthdayListView` — sorted by upcoming
  - `AddBirthdaySheet` — name, month, day, optional birth year, notes
- **Tests**: `BirthdayStoreTests`

## Phase-specific API notes

- Update uses `PATCH /birthdays/items/{id}`, not POST.

## Acceptance criteria

List shows birthdays sorted by upcoming date. Age calculated from `birthYear` if provided. Can add/edit/delete. All tests pass.
