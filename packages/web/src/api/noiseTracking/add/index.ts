import { API_BASE_URL } from '../../index'
import { createFetchOptions } from '../../../utils/api'

export const addNoiseTrackingItem = async (projectId?: string, isPrivate?: boolean): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/noise_tracking/items`, createFetchOptions({
    method: 'PUT',
    ...(isPrivate && { body: JSON.stringify({ isPrivate: true }) }),
  }, projectId))

  if (!response.ok) {
    throw new Error('Failed to add a noise tracking item')
  }
}
