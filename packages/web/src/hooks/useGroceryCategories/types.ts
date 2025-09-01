import { IGroceryItem } from '../../providers/AppStateProvider/types'
import { GroceryCategory } from '../../enums/groceryCategory'

export interface ICategorizedGroceryGroup {
  category: GroceryCategory
  items: IGroceryItem[]
  label: string
}

export interface IUseGroceryCategoriesResult {
  categorizedGroups: ICategorizedGroceryGroup[] | null
}