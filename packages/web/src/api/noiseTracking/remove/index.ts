import { NOISE_TRACKING_API_URL } from '..'
import { createFetchOptions } from '../../../utils/api'

export const removeNoiseTrackingItem = async (timestamp: number): Promise<void> => {
  const response = await fetch(`${NOISE_TRACKING_API_URL}/noise_tracking/items/${timestamp}`, createFetchOptions({
    method: 'DELETE',
  }))

  if (!response.ok) {
    throw new Error('Failed to remove noise tracking item')
  }
}
