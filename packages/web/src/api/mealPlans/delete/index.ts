import { API_BASE_URL } from '../../index'
import { createFetchOptions } from '../../../utils/api'

export const deleteMealPlan = async (id: string, projectId?: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/meal-plans/${id}`, createFetchOptions({
    method: 'DELETE',
  }, projectId))

  if (!response.ok) {
    throw new Error('Failed to delete meal plan')
  }
}
