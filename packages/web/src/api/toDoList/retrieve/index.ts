import { API_BASE_URL } from '../../index'
import { ITodoItem } from './types'

export const retrieveToDoList = async (): Promise<Array<ITodoItem>> => {
  const response = await fetch(`${API_BASE_URL}/todo_list/items`)

  if (response.ok) {
    return await response.json()
  }

  return []
}

