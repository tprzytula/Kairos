import { SHOPS_API_URL } from '../'
import { ICreateShopRequestBody } from '../types'
import { createFetchOptions } from '../../../utils/api'

export const addShop = async (shop: ICreateShopRequestBody, projectId?: string): Promise<{ id: string }> => {
  const response = await fetch(`${SHOPS_API_URL}/shops`, createFetchOptions({
    method: 'PUT',
    body: JSON.stringify(shop),
  }, projectId))

  if (response.status === 409) {
    throw new Error("Shop name already exists");
  }

  if (response.ok) {
    const data = await response.json()
    return data as { id: string }
  }

  throw new Error('Failed to add shop')
}
