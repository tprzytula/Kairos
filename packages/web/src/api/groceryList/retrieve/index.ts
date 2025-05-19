import { GROCERY_LIST_API_URL } from '..'
import { IDBGroceryItem, IDBGroceryItemDefault } from './types'

export const retrieveGroceryList = async (): Promise<Array<IDBGroceryItem>> => {
  const response = await fetch(`${GROCERY_LIST_API_URL}/grocery_list/items`)

  if (response.ok) {
    return await response.json()
  }

  return []
}

export const retrieveGroceryListDefaults = async (): Promise<Array<IDBGroceryItemDefault>> => {
  const response = await fetch(`${GROCERY_LIST_API_URL}/grocery_list/items_defaults`)

  if (response.ok) {
    return await response.json()
  }

  return []
}
