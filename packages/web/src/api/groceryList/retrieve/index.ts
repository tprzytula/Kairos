import { GROCERY_LIST_API_URL } from '..'
import { IDBGroceryItem, IDBGroceryItemDefault } from './types'
import { createFetchOptions } from '../../../utils/api'

export const retrieveGroceryList = async (): Promise<Array<IDBGroceryItem>> => {
  const response = await fetch(`${GROCERY_LIST_API_URL}/grocery_list/items`, createFetchOptions())

  if (response.ok) {
    return await response.json()
  }

  return []
}

export const retrieveGroceryListDefaults = async (): Promise<Array<IDBGroceryItemDefault>> => {
  const response = await fetch(`${GROCERY_LIST_API_URL}/grocery_list/items_defaults`, createFetchOptions())

  if (response.ok) {
    return await response.json()
  }

  return []
}
