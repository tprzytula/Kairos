# Phase 3c — Grocery Store + List Views

**Goal**: Grocery list display with 3 view modes.

**Depends on**: Phase 3b (Shops).

**Read first**: `00-overview.md`, `01-cross-cutting.md`.
**Reference as needed**: `api-reference.md` (Grocery Items section), `models.md` (`GroceryItem`, `GroceryCategory`, `GroceryViewMode`, `GroceryItemUnit`).

## Deliverables

- **Store**: `GroceryStore` (does NOT conform to `EntityStore` — uses batch operations). Batch add via `PUT /grocery_list/items` with `{ items: [...] }` (max 25). Single update via `PATCH /grocery_list/items/{id}`. `quantity` is a **String on the wire** — use custom `Codable` or a computed property to convert to/from `Double`.
- **Views**:
  - `GroceryListView` — supports 3 view modes: categorized, alphabetical, uncategorized
  - `GroceryItemRow` — swipe actions + tap to toggle `purchasedItems` in `AppStateStore`
  - `GroceryCategorySection`
  - `GroceryViewModePicker`
- **Utilities**: `CategoryMatcher` — port from `packages/web/src/utils/grocery/categoryMatcher.ts`
- **Tests**: `GroceryStoreTests`, `CategoryMatcherTests`

## Phase-specific API notes

- Batch add: `PUT /grocery_list/items` with `{ items: [...], isPrivate?: true }` (max 25 items).
- Single update: `PATCH /grocery_list/items/{id}`.
- `quantity` is a **String** on the wire (e.g., `"5"`).
- Purchased items are tracked in `AppStateStore.purchasedItems` (ephemeral, not persisted to backend).

## Acceptance criteria

Navigate from shop to its grocery list. Items grouped by category (categorized mode), alphabetical, or flat. Tap item → struck-through (added to `purchasedItems`). Swipe to delete. View mode picker switches between 3 modes. Pull-to-refresh. All tests pass.
