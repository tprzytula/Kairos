import { API_BASE_URL } from '../../index'
import { ITodoItemUpdate } from './types'
import { createFetchOptions } from '../../../utils/api'

export const updateToDoItems = async (items: Array<ITodoItemUpdate>, projectId?: string): Promise<Array<ITodoItemUpdate>> => {
  const response = await fetch(`${API_BASE_URL}/todo_list/items`, createFetchOptions({
    method: 'POST',
    body: JSON.stringify({
      items,
    }),
  }, projectId))

  if (response.ok) {
    return await response.json()
  }

  return []
}

export * from './updateSingle'
