import { GROCERY_LIST_API_URL } from '..'
import { IGroceryItem, IGroceryItemDefault } from './types'

export const retrieveGroceryList = async (): Promise<Array<IGroceryItem>> => {
  const response = await fetch(`${GROCERY_LIST_API_URL}/grocery_list/items`)

  if (response.ok) {
    return await response.json()
  }

  return []
}

export const retrieveGroceryListDefaults = async (): Promise<Array<IGroceryItemDefault>> => {
  const response = await fetch(`${GROCERY_LIST_API_URL}/grocery_list/items_defaults`)

  if (response.ok) {
    return await response.json()
  }

  return []
}
