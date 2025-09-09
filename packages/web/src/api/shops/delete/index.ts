import { API_BASE_URL } from '../../index'
import { createFetchOptions } from '../../../utils/api'

export const deleteShop = async (shopId: string, projectId?: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/shops/${shopId}`, createFetchOptions({
    method: 'DELETE',
  }, projectId))

  if (!response.ok) {
    throw new Error('Failed to delete shop')
  }
}
