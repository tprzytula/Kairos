import { API_BASE_URL } from '../../index'
import { IUserPreferences, IUpdateUserPreferencesRequest } from '../../../types/userPreferences'
import { createFetchOptions } from '../../../utils/api'

export const updateUserPreferences = async (
  preferences: IUpdateUserPreferencesRequest,
  accessToken?: string
): Promise<IUserPreferences> => {
  const response = await fetch(
    `${API_BASE_URL}/user/preferences`, 
    createFetchOptions({
      method: 'PUT',
      body: JSON.stringify(preferences),
    }, undefined, accessToken)
  )

  if (response.ok) {
    return await response.json()
  }

  throw new Error('Failed to update user preferences')
}
