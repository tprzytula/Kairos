import { SHOPS_API_URL } from '../'
import { IDBShop } from '../types'
import { createFetchOptions } from '../../../utils/api'

export const retrieveShops = async (projectId?: string): Promise<Array<IDBShop>> => {
  const response = await fetch(`${SHOPS_API_URL}/shops`, createFetchOptions({}, projectId))

  if (response.ok) {
    return await response.json()
  }

  return []
}
