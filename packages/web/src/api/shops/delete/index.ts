import { SHOPS_API_URL } from '../'
import { createFetchOptions } from '../../../utils/api'

export const deleteShop = async (shopId: string, projectId?: string): Promise<void> => {
  const response = await fetch(`${SHOPS_API_URL}/shops/${shopId}`, createFetchOptions({
    method: 'DELETE',
  }, projectId))

  if (!response.ok) {
    throw new Error('Failed to delete shop')
  }
}
