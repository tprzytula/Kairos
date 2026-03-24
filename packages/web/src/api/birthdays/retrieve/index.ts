import { API_BASE_URL } from '../../index'
import { IBirthdayItem } from './types'
import { createFetchOptions } from '../../../utils/api'

export const retrieveBirthdays = async (projectId?: string): Promise<Array<IBirthdayItem>> => {
  const response = await fetch(`${API_BASE_URL}/birthdays/items`, createFetchOptions({}, projectId))

  if (response.ok) {
    return await response.json()
  }

  throw new Error(`Failed to fetch birthdays: ${response.status}`)
}
