import { API_BASE_URL } from '../../index'
import { createFetchOptions } from '../../../utils/api'

export const sendAgentMessage = async (message: string, accessToken?: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/agent/message`, createFetchOptions({
    method: 'POST',
    body: JSON.stringify({ message }),
  }, undefined, accessToken))

  if (response.ok) {
    return await response.json()
  }

  throw new Error('Failed to send agent message')
}
