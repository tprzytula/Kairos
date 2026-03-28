import { IAdventure } from '../../../types/adventure'
import { API_BASE_URL } from '../../index'
import { createFetchOptions } from '../../../utils/api'
import { IAddAdventureRequest } from '../types'

export const addAdventure = async (
  adventure: IAddAdventureRequest,
  projectId?: string
): Promise<IAdventure> => {
  const { isPrivate, ...adventureData } = adventure
  const response = await fetch(`${API_BASE_URL}/adventures`, createFetchOptions({
    method: 'PUT',
    body: JSON.stringify({
      ...adventureData,
      ...(isPrivate && { isPrivate: true }),
    }),
  }, projectId))

  if (response.ok) {
    const data = await response.json()

    if (data.id) {
      return data
    }

    throw new Error('Unexpected response from API')
  }

  throw new Error('Failed to add adventure')
}
