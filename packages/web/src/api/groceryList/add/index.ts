import { GroceryItem } from '../../../providers/AppStateProvider/types'
import { GROCERY_LIST_API_URL } from '..'

export const addGroceryItem = async (item: Omit<GroceryItem, 'id'>): Promise<GroceryItem> => {
  const response = await fetch(`${GROCERY_LIST_API_URL}/grocery_list/items`, {
    method: 'PUT',
    body: JSON.stringify(item),
  })

  if (response.ok) {
    const data = await response.json()

    if (data.id) {
      return data
    }

    throw new Error('Unexpected response from API')
  }

  throw new Error('Failed to add a grocery item')
}
