import { API_BASE_URL } from '../../index'
import { createFetchOptions } from '../../../utils/api'

export const addNoiseTrackingItem = async (projectId?: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/noise_tracking/items`, createFetchOptions({
    method: 'PUT',
  }, projectId))

  if (!response.ok) {
    throw new Error('Failed to add a noise tracking item')
  }
}
