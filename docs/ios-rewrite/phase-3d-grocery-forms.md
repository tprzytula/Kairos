# Phase 3d — Grocery Item Forms

**Goal**: Add and edit grocery items.

**Depends on**: Phase 3c.

**Read first**: `00-overview.md`, `01-cross-cutting.md`.
**Reference as needed**: `api-reference.md` (Grocery Items + Grocery Item Defaults sections), `models.md` (`GroceryItem`, `GroceryItemDefault`, `GroceryItemUnit`).

## Deliverables

- **Views**:
  - `AddGroceryItemView` — name, quantity (numeric input), unit selector from `GroceryItemUnit`, category, shop assignment
  - `EditGroceryItemView`
- **Integration**: Uses `GroceryItemDefault` for autocomplete suggestions (fetched from user-scoped `/grocery_list/items_defaults` endpoint — NO `X-Project-ID` header).

## Phase-specific API notes

- Grocery item defaults are **user-scoped** (no `X-Project-ID`) and keyed by **name** not id: `PATCH /grocery_list/items_defaults/{name}`.

## Acceptance criteria

Add form shows name, quantity (numeric input), unit (picker from `GroceryItemUnit`), category. Autocomplete from defaults works. Edit form pre-fills existing values. Submit calls appropriate API. New item appears in list without manual refresh.
