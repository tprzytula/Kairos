import { IGroceryItem } from '../../../providers/AppStateProvider/types'
import { API_BASE_URL } from '../../index'
import { createFetchOptions } from '../../../utils/api'

export const addGroceryItem = async (item: Omit<IGroceryItem, 'id' | 'toBeRemoved'>, projectId?: string): Promise<IGroceryItem> => {
  const response = await fetch(`${API_BASE_URL}/grocery_list/items`, createFetchOptions({
    method: 'PUT',
    body: JSON.stringify(item),
  }, projectId))

  if (response.ok) {
    const data = await response.json()

    if (data.id) {
      return data
    }

    throw new Error('Unexpected response from API')
  }

  throw new Error('Failed to add a grocery item')
}
