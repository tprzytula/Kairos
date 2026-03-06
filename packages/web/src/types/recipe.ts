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
    ingredients: IRecipeIngredient[]
    createdAt: string
    updatedAt: string
}
