import { NOISE_TRACKING_API_URL } from '../index'

export const addNoiseTrackingItem = async (): Promise<void> => {
  const response = await fetch(`${NOISE_TRACKING_API_URL}/noise_tracking`, {
    method: 'PUT',
  })

  if (!response.ok) {
    throw new Error('Failed to add a noise tracking item')
  }
}
