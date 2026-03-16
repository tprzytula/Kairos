import { IMealPlan } from '../../../types/mealPlan'
import { API_BASE_URL } from '../../index'
import { createFetchOptions } from '../../../utils/api'

export const addMealPlan = async (
  mealPlan: { date: string; recipeName: string; recipeId?: string; mealType?: string },
  projectId?: string
): Promise<IMealPlan> => {
  const response = await fetch(`${API_BASE_URL}/meal-plans`, createFetchOptions({
    method: 'PUT',
    body: JSON.stringify(mealPlan),
  }, projectId))

  if (response.ok) {
    const data = await response.json()

    if (data.id) {
      return data
    }

    throw new Error('Unexpected response from API')
  }

  throw new Error('Failed to add meal plan')
}
