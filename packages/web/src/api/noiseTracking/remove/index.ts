import { API_BASE_URL } from '../../index'
import { createFetchOptions } from '../../../utils/api'

export const removeNoiseTrackingItem = async (timestamp: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/noise_tracking/items/${timestamp}`, createFetchOptions({
    method: 'DELETE',
  }))

  if (!response.ok) {
    throw new Error('Failed to remove noise tracking item')
  }
}
