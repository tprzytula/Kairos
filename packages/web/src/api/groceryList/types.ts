import { GroceryItemUnit } from '../../enums/groceryItem'

export type GroceryItemUpdateFields = {
  name?: string
  quantity?: number
  unit?: GroceryItemUnit
  imagePath?: string
}
