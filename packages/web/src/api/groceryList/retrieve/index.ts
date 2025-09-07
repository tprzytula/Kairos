import { GROCERY_LIST_API_URL } from '..'
import { IDBGroceryItem, IDBGroceryItemDefault } from './types'
import { createFetchOptions } from '../../../utils/api'

export const retrieveGroceryList = async (projectId?: string, shopId?: string): Promise<Array<IDBGroceryItem>> => {
  const url = new URL(`${GROCERY_LIST_API_URL}/grocery_list/items`)
  if (shopId) {
    url.searchParams.append('shopId', shopId)
  }
  
  const response = await fetch(url.toString(), createFetchOptions({}, projectId))

  if (response.ok) {
    return await response.json()
  }

  return []
}

export const retrieveGroceryListDefaults = async (projectId?: string): Promise<Array<IDBGroceryItemDefault>> => {
  const response = await fetch(`${GROCERY_LIST_API_URL}/grocery_list/items_defaults`, createFetchOptions({}, projectId))

  if (response.ok) {
    return await response.json()
  }

  return []
}
