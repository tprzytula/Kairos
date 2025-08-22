import { GroceryItemUnit, GroceryItemCategory } from '../../enums'

export interface IGroceryItem {
    id: string
    projectId: string
    imagePath: string
    name: string
    quantity: number
    unit: GroceryItemUnit
    category?: GroceryItemCategory
}
  
export interface IGroceryItemDefault {
    name: string
    icon?: string
    unit?: GroceryItemUnit
}
