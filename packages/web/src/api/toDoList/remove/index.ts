import { API_BASE_URL } from '../../index'

export const removeTodoItems = async (ids: Array<string>): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/todo_list/items`, {
    method: 'DELETE',
    body: JSON.stringify({ ids }),
  })

  if (!response.ok) {
    throw new Error('Failed to remove todo items')
  }
}
