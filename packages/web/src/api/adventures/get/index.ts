import { IAdventure } from '../../../types/adventure'
import { API_BASE_URL } from '../../index'
import { createFetchOptions } from '../../../utils/api'

export const getAdventures = async (projectId?: string): Promise<IAdventure[]> => {
  const response = await fetch(`${API_BASE_URL}/adventures`, createFetchOptions({}, projectId))

  if (response.ok) {
    return await response.json()
  }

  return []
}
