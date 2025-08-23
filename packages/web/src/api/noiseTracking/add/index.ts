import { NOISE_TRACKING_API_URL } from '../index'
import { createFetchOptions } from '../../../utils/api'

export const addNoiseTrackingItem = async (projectId?: string): Promise<void> => {
  const response = await fetch(`${NOISE_TRACKING_API_URL}/noise_tracking/items`, createFetchOptions({
    method: 'PUT',
  }, projectId))

  if (!response.ok) {
    throw new Error('Failed to add a noise tracking item')
  }
}
