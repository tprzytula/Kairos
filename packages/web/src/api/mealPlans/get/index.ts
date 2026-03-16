import { IMealPlan } from '../../../types/mealPlan'
import { API_BASE_URL } from '../../index'
import { createFetchOptions } from '../../../utils/api'

export const getMealPlans = async (projectId?: string): Promise<IMealPlan[]> => {
  const response = await fetch(`${API_BASE_URL}/meal-plans`, createFetchOptions({}, projectId))

  if (response.ok) {
    return await response.json()
  }

  return []
}
