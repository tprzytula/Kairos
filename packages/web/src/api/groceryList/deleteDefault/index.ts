import { API_BASE_URL } from '../../index'
import { createFetchOptions } from '../../../utils/api'

export const deleteGroceryItemDefault = async (name: string, projectId?: string): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/grocery_list/items_defaults/${encodeURIComponent(name)}`,
    createFetchOptions({ method: 'DELETE' }, projectId)
  )

  if (!response.ok) {
    throw new Error('Failed to delete grocery item default')
  }
}
