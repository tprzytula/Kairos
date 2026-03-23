import { API_BASE_URL } from '../../index'
import { createFetchOptions } from '../../../utils/api'
import { IUpdateAdventureRequest } from '../types'

export const updateAdventure = async (
  id: string,
  fields: IUpdateAdventureRequest,
  projectId?: string
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/adventures/${id}`, createFetchOptions({
    method: 'POST',
    body: JSON.stringify({ id, ...fields }),
  }, projectId))

  if (!response.ok) {
    throw new Error('Failed to update adventure')
  }
}
