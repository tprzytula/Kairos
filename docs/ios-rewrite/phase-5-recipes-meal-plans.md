# Phase 5 — Recipes + Meal Plans

**Goal**: Recipe library and meal planning.

**Depends on**: Phase 3a (shared views). Runs in parallel with 3b–3d, 4, 7a–d, 8a.

**Read first**: `00-overview.md`, `01-cross-cutting.md`.
**Reference as needed**: `api-reference.md` (Recipes + Meal Plans sections), `models.md` (`Recipe`, `RecipeIngredient`, `MealPlan`, `MealType`, `RecipeDishType`).

## Deliverables

- **Stores**:
  - `RecipeStore` — conforms to `EntityStore` protocol. Update via `POST /recipes/{id}`.
  - `MealPlanStore` — conforms to `EntityStore` protocol. Update via `POST /meal-plans/{id}`.
- **Views**:
  - `RecipeListView` — search by name + filter by `mealType` / `dishType`
  - `RecipeCard`
  - `RecipeDetailView` — ingredients list, instructions, external link
  - `AddRecipeView` — ingredient builder with name/quantity/unit
  - `EditRecipeView`
  - `RecipeFilterSheet` — multi-select `mealType` + `dishType`
  - `AddMealPlanSheet` — date picker, recipe selector, meal type
- **Features**: Image upload via pre-signed S3 URL (`GET /recipes/upload-url?extension=jpg` → PUT bytes to `uploadUrl` → save `imagePath` on entity)
- **Tests**: `RecipeStoreTests`, `MealPlanStoreTests`

## Acceptance criteria

Recipe list shows cards with images. Search filters by name. Filter sheet narrows by meal type and dish type. Recipe detail shows ingredients, instructions, external link. Can add recipe with ingredient builder (add/remove rows). Image upload works (pick photo → upload → display). Meal plan sheet lets user pick date + recipe + meal type. All tests pass.
