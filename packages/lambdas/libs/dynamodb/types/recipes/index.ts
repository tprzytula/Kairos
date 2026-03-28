import { GroceryItemUnit } from '../../enums'
import { IPrivateItemFields } from '../visibility'

export interface IRecipeIngredient {
    name: string
    quantity: number
    unit: GroceryItemUnit
}

export interface IRecipe extends IPrivateItemFields {
    id: string
    projectId: string
    name: string
    imagePath?: string
    externalLink?: string
    ingredients: string  // JSON-serialized IRecipeIngredient[]
    instructions?: string  // JSON-serialized string[]
    mealTypes?: string  // JSON-serialized MealType[]
    dishTypes?: string  // JSON-serialized RecipeDishType[]
    createdAt: string
    updatedAt: string
}
