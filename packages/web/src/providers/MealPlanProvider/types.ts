import { IMealPlan } from '../../types/mealPlan'

export interface IState {
  mealPlans: IMealPlan[]
  isLoading: boolean
  fetchMealPlans: () => Promise<void>
  addMealPlan: (date: string, recipeName: string, recipeId?: string) => Promise<void>
  updateMealPlan: (id: string, fields: { date?: string; recipeName?: string; recipeId?: string | null }) => Promise<void>
  removeMealPlan: (id: string) => Promise<void>
}

export interface IMealPlanProviderProps {
  children: React.ReactNode
}
