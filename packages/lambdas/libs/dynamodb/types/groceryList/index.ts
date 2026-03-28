import { GroceryItemUnit, GroceryItemCategory } from '../../enums'
import { IPrivateItemFields } from '../visibility'

export interface IGroceryItem extends IPrivateItemFields {
    id: string
    projectId: string
    shopId: string
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
