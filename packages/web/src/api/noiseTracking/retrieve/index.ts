import { NOISE_TRACKING_API_URL } from '../index'
import { createFetchOptions } from '../../../utils/api'

export interface INoiseTrackingItem {
  timestamp: number
}

export const retrieveNoiseTrackingItems = async (): Promise<Array<INoiseTrackingItem>> => {
  const response = await fetch(`${NOISE_TRACKING_API_URL}/noise_tracking/items`, createFetchOptions())

  if (response.ok) {
    return await response.json()
  }

  return []
}
