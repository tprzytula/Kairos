import { ITodoItem } from '../retrieve/types'
import { API_BASE_URL } from '../../index'

export const addTodoItem = async (item: Omit<ITodoItem, 'id'>): Promise<ITodoItem> => {
  const response = await fetch(`${API_BASE_URL}/todo_list/items`, {
    method: 'PUT',
    body: JSON.stringify(item),
  })

  if (response.ok) {
    const data = await response.json()

    if (data.id) {
      return data
    }

    throw new Error('Unexpected response from API')
  }

  throw new Error('Failed to add a todo item')
}
