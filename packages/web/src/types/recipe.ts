import { GroceryItemUnit } from '../enums/groceryItem'
import { MealType } from '@kairos/shared'
import { RecipeDishType } from '@kairos/shared'

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
    mealTypes?: MealType[]
    dishTypes?: RecipeDishType[]
    createdAt: string
    updatedAt: string
    visibility?: "private"
    ownerId?: string
}
