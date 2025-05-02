import { API_BASE_URL } from '../../index'
import { ITodoItemUpdate } from './types'

export const updateToDoItems = async (items: Array<ITodoItemUpdate>): Promise<Array<ITodoItemUpdate>> => {
  const response = await fetch(`${API_BASE_URL}/todo_list/items`, {
    method: 'POST',
    body: JSON.stringify(items),
  })

  if (response.ok) {
    return await response.json()
  }

  return []
}
