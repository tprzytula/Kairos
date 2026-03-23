import { API_BASE_URL } from '../../index'
import { createFetchOptions } from '../../../utils/api'

export const updateAdventure = async (
  id: string,
  fields: { name?: string; date?: string; time?: string | null; location?: string | null; notes?: string | null },
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
