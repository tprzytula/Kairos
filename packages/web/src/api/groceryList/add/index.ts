import { IGroceryItem } from '../../../providers/AppStateProvider/types'
import { GROCERY_LIST_API_URL } from '..'
import { createFetchOptions } from '../../../utils/api'

export const addGroceryItem = async (item: Omit<IGroceryItem, 'id' | 'toBeRemoved'>): Promise<IGroceryItem> => {
  const response = await fetch(`${GROCERY_LIST_API_URL}/grocery_list/items`, createFetchOptions({
    method: 'PUT',
    body: JSON.stringify(item),
  }))

  if (response.ok) {
    const data = await response.json()

    if (data.id) {
      return data
    }

    throw new Error('Unexpected response from API')
  }

  throw new Error('Failed to add a grocery item')
}
