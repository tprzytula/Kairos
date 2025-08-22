import { GROCERY_LIST_API_URL } from '..'
import { createFetchOptions } from '../../../utils/api'

export const removeGroceryItems = async (ids: Array<string>): Promise<void> => {
  const response = await fetch(`${GROCERY_LIST_API_URL}/grocery_list/items`, createFetchOptions({
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  }))

  if (!response.ok) {
    throw new Error('Failed to remove grocery items')
  }
}
