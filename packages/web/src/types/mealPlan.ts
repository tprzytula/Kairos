import { MealType } from '../enums/mealType'

export interface IMealPlan {
    id: string
    projectId: string
    date: string          // YYYY-MM-DD
    recipeName: string    // display name (custom or from linked recipe)
    recipeId?: string     // optional link to existing IRecipe
    mealType?: MealType
    createdAt: string
    updatedAt: string
}
