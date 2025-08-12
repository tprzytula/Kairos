import { GroceryItemUnit } from "../../../enums/groceryItem"

export interface IDBGroceryItem {
  id: string
  name: string
  quantity: number
  unit: GroceryItemUnit
  imagePath?: string
  category?: string
}

export interface IDBGroceryItemDefault {
  name: string
  unit?: GroceryItemUnit
  icon?: string
  category?: string
}
