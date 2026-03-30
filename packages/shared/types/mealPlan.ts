import { MealType } from '../enums/mealType'

export interface IMealPlan {
  id: string
  projectId: string
  date: string
  recipeName: string
  recipeId?: string
  mealType?: MealType
  imagePath?: string
  createdAt: string
  updatedAt: string
  visibility?: 'private'
  ownerId?: string
}
