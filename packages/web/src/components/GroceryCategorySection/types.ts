import { IGroceryItem } from '../../providers/AppStateProvider/types'
import { GroceryCategory } from '../../enums/groceryCategory'

export interface IGroceryCategorySectionProps {
  categoryLabel: string
  category: GroceryCategory
  items: IGroceryItem[]
  onDelete: (id: string) => void
  onEdit: (id: string) => void
  expandTo?: boolean | null
  expandKey?: number
}