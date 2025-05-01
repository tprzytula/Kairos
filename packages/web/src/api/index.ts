import { GroceryItem } from '../state/types'

const API_BASE_URL = 'TBD'

export const retrieveGroceryList = async (): Promise<Array<GroceryItem>> => {
  const response = await fetch(`${API_BASE_URL}/grocery_list/items`)

  if (response.ok) {
    return await response.json()
  }

  return []
}
