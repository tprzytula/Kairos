# Phase 3b — Shops

**Goal**: User can manage shops (CRUD).

**Depends on**: Phase 3a.

**Read first**: `00-overview.md`, `01-cross-cutting.md`.
**Reference as needed**: `api-reference.md` (Shops section), `models.md` (`Shop`).

## Deliverables

- **Store**: `ShopStore` — conforms to `EntityStore` protocol (see `01-cross-cutting.md`). Update uses `PATCH /shops/{id}`.
- **Views**:
  - `ShopListView`
  - `ShopRowView`
  - `AddShopSheet`
  - `EditShopSheet`
- **Tests**: `ShopStoreTests`

## Phase-specific API notes

- Shop update uses `PATCH /shops/{id}`, not POST.
- Status 409 on shop creation = duplicate name. Surface as user-facing message.

## Acceptance criteria

User sees list of shops sorted by name. Can add a shop (name + optional icon). Can edit shop name/icon via swipe action. Can delete shop via swipe action. Pull-to-refresh reloads from API. Empty state shown when no shops. All tests pass.
