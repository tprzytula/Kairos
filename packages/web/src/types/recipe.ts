import { GroceryItemUnit } from '../enums/groceryItem'
import { MealType } from '../enums/mealType'
import { RecipeDishType } from '../enums/recipeDishType'

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
}
