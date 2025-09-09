import { API_BASE_URL } from '../../index'
import { createFetchOptions } from '../../../utils/api'
import { INoiseTrackingItem } from '../types'

export const retrieveNoiseTrackingItems = async (projectId?: string): Promise<Array<INoiseTrackingItem>> => {
  const response = await fetch(`${API_BASE_URL}/noise_tracking/items`, createFetchOptions({}, projectId))

  if (response.ok) {
    return await response.json()
  }

  return []
}
