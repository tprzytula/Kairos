import { GroceryItemUnit } from '../../enums'

export interface IRecipeIngredient {
    name: string
    quantity: number
    unit: GroceryItemUnit
}

export interface IRecipe {
    id: string
    projectId: string
    name: string
    ingredients: string  // JSON-serialized IRecipeIngredient[]
    createdAt: string
    updatedAt: string
}
