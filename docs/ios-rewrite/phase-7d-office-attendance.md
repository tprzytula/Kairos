# Phase 7d — Office Attendance

**Goal**: Office day tracking.

**Depends on**: Phase 3a. Runs in parallel with 3b–3d, 4, 5, 7a–c, 8a.

**Read first**: `00-overview.md`, `01-cross-cutting.md`.
**Reference as needed**: `api-reference.md` (Office Attendance section), `models.md` (`OfficeAttendance`).

## Deliverables

- **Store**: `OfficeAttendanceStore` (does NOT conform to `EntityStore` — no update endpoint, create-only + delete).
- **Views**:
  - `OfficeAttendanceView` — calendar marking office days, quick-add for today
- **Tests**: `OfficeAttendanceStoreTests`

## Acceptance criteria

Calendar shows office days marked. Can add attendance for a date. Can delete attendance. Shows who else is in the office (from project members). All tests pass.
