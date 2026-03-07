import { IBirthdayItem } from '../retrieve/types'
import { API_BASE_URL } from '../../index'
import { createFetchOptions } from '../../../utils/api'

export const addBirthday = async (item: Omit<IBirthdayItem, 'id'>, projectId?: string): Promise<{ id: string }> => {
  const response = await fetch(`${API_BASE_URL}/birthdays/items`, createFetchOptions({
    method: 'PUT',
    body: JSON.stringify(item),
  }, projectId))

  if (response.ok) {
    const data = await response.json()

    if (data.id) {
      return data
    }

    throw new Error('Unexpected response from API')
  }

  throw new Error('Failed to add birthday')
}
