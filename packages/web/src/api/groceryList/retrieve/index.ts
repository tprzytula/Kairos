import { GroceryItem } from '../../../providers/AppStateProvider/types'
import { GROCERY_LIST_API_URL } from '..'

export const retrieveGroceryList = async (): Promise<Array<GroceryItem>> => {
  const response = await fetch(`${GROCERY_LIST_API_URL}/grocery_list/items`)

  if (response.ok) {
    return await response.json()
  }

  return []
}
