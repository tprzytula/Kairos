import { IMealPlan } from '../../types/mealPlan'

import { MealType } from '../../enums/mealType'

export interface IState {
  mealPlans: IMealPlan[]
  isLoading: boolean
  fetchMealPlans: () => Promise<void>
  addMealPlan: (date: string, recipeName: string, recipeId?: string, mealType?: MealType, imagePath?: string, isPrivate?: boolean) => Promise<void>
  updateMealPlan: (id: string, fields: { date?: string; recipeName?: string; recipeId?: string | null; mealType?: MealType | null; imagePath?: string | null }) => Promise<void>
  removeMealPlan: (id: string) => Promise<void>
}

export interface IMealPlanProviderProps {
  children: React.ReactNode
}
