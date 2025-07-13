import { GroceryItemUnit } from '../../enums'

export interface IGroceryItem {
    id: string
    imagePath: string
    name: string
    quantity: number
    unit: GroceryItemUnit
}
  
export interface IGroceryItemDefault {
    name: string
    icon?: string
    unit?: GroceryItemUnit
}
