import { IBirthdayItem } from '../retrieve/types'
import { API_BASE_URL } from '../../index'
import { createFetchOptions } from '../../../utils/api'

export type BirthdayUpdateFields = Partial<Omit<IBirthdayItem, 'id'>> & { isPrivate?: boolean }

export const updateBirthday = async (id: string, fields: BirthdayUpdateFields, projectId?: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/birthdays/items/${id}`, createFetchOptions({
    method: 'PATCH',
    body: JSON.stringify({ id, ...fields }),
  }, projectId))

  if (!response.ok) {
    throw new Error('Failed to update birthday')
  }
}
