import { GroceryItemUnit } from '../enums/groceryItem'

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
    externalLink?: string
    ingredients: IRecipeIngredient[]
    instructions?: string[]
    createdAt: string
    updatedAt: string
}
