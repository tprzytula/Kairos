import { API_BASE_URL } from '../../index'
import { IDBShop } from '../types'
import { createFetchOptions } from '../../../utils/api'

export const retrieveShops = async (projectId?: string): Promise<Array<IDBShop>> => {
  const response = await fetch(`${API_BASE_URL}/shops`, createFetchOptions({}, projectId))

  if (response.ok) {
    return await response.json()
  }

  return []
}
