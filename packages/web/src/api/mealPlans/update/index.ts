import { API_BASE_URL } from '../../index'
import { createFetchOptions } from '../../../utils/api'

export const updateMealPlan = async (
  id: string,
  fields: { date?: string; recipeName?: string; recipeId?: string | null },
  projectId?: string
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/meal-plans/${id}`, createFetchOptions({
    method: 'POST',
    body: JSON.stringify({ id, ...fields }),
  }, projectId))

  if (!response.ok) {
    throw new Error('Failed to update meal plan')
  }
}
