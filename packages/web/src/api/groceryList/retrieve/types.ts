import { GroceryItemUnit } from "../../../enums/groceryItem"

export interface IGroceryItem {
  id: string
  name: string
  quantity: number
  unit: GroceryItemUnit
  imagePath?: string
}

export interface IGroceryItemDefault {
  name: string
  unit?: GroceryItemUnit
  icon?: string
}
