import { GroceryItem } from '../providers/AppStateProvider/types'

const API_BASE_URL = 'https://crff1u9wbc.execute-api.eu-west-2.amazonaws.com/v1'

export const retrieveGroceryList = async (): Promise<Array<GroceryItem>> => {
  const response = await fetch(`${API_BASE_URL}/grocery_list/items`)

  if (response.ok) {
    return await response.json()
  }

  return []
}

export const createGroceryItem = async (item: Omit<GroceryItem, 'id' | 'imagePath'>): Promise<GroceryItem> => {
  const response = await fetch(`${API_BASE_URL}/grocery_list/items`, {
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

  throw new Error('Failed to create grocery item')
}
