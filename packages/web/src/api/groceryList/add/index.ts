import { IGroceryItem } from '../../../providers/AppStateProvider/types'
import { API_BASE_URL } from '../../index'
import { createFetchOptions } from '../../../utils/api'

type GroceryItemInput = Omit<IGroceryItem, 'id' | 'toBeRemoved'>

export const addGroceryItem = async (item: GroceryItemInput, projectId?: string): Promise<IGroceryItem> => {
  const result = await addGroceryItems([item], projectId)
  return { ...item, ...result[0] } as IGroceryItem
}

export const addGroceryItems = async (items: GroceryItemInput[], projectId?: string): Promise<Array<{ id: string }>> => {
  const response = await fetch(`${API_BASE_URL}/grocery_list/items`, createFetchOptions({
    method: 'PUT',
    body: JSON.stringify({ items }),
  }, projectId))

  if (response.ok) {
    const data = await response.json()

    if (data.items && Array.isArray(data.items)) {
      return data.items
    }

    throw new Error('Unexpected response from API')
  }

  throw new Error('Failed to add grocery items')
}
