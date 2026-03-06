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
    imagePath?: string
    ingredients: string  // JSON-serialized IRecipeIngredient[]
    instructions?: string  // JSON-serialized string[]
    createdAt: string
    updatedAt: string
}
