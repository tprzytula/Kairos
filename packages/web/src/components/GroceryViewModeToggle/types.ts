import { GroceryViewMode } from '../../enums/groceryCategory'

export interface IGroceryViewModeToggleProps {
  viewMode: GroceryViewMode
  onViewModeChange: (mode: GroceryViewMode) => void
}