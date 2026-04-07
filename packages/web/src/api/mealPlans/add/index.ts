import { IMealPlan } from '../../../types/mealPlan'
import { createAddFetcher } from '../../index'

const addFetcher = createAddFetcher<IMealPlan>('meal-plans', 'meal plan')

export const addMealPlan = async (
  mealPlan: { date: string; recipeName: string; recipeId?: string; mealType?: string; imagePath?: string },
  projectId?: string,
  isPrivate?: boolean
): Promise<IMealPlan> => {
  return addFetcher(mealPlan, projectId, isPrivate)
}
