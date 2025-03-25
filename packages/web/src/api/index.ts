import { GroceryItem } from '../providers/AppStateProvider/types'

const API_BASE_URL = 'https://crff1u9wbc.execute-api.eu-west-2.amazonaws.com/v1'

export const retrieveGroceryList = async (): Promise<Array<GroceryItem>> => {
  const response = await fetch(`${API_BASE_URL}/grocery_list/items`)

  if (response.ok) {
    return await response.json()
  }

  return []
}
