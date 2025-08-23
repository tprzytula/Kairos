import { API_BASE_URL } from '../../index'
import { IUserPreferences } from '../../../types/userPreferences'
import { createFetchOptions } from '../../../utils/api'

export const getUserPreferences = async (accessToken?: string): Promise<IUserPreferences> => {
  const response = await fetch(`${API_BASE_URL}/user/preferences`, createFetchOptions({}, undefined, accessToken))

  if (response.ok) {
    return await response.json()
  }

  throw new Error('Failed to retrieve user preferences')
}
