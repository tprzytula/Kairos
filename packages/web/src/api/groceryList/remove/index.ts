import { API_BASE_URL } from '../../index'
import { createFetchOptions } from '../../../utils/api'

export const removeGroceryItems = async (ids: Array<string>, projectId?: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/grocery_list/items`, createFetchOptions({
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  }, projectId))

  if (!response.ok) {
    throw new Error('Failed to remove grocery items')
  }
}
