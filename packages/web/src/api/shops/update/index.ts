import { SHOPS_API_URL } from '../'
import { IUpdateShopRequestBody } from '../types'
import { createFetchOptions } from '../../../utils/api'

export const updateShop = async (shop: IUpdateShopRequestBody, projectId?: string): Promise<void> => {
  const response = await fetch(`${SHOPS_API_URL}/shops/${shop.id}`, createFetchOptions({
    method: 'PATCH',
    body: JSON.stringify(shop),
  }, projectId))

  if (!response.ok) {
    throw new Error('Failed to update shop')
  }
}
