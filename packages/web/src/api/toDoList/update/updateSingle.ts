import { API_BASE_URL } from '../../index'
import { IStep } from '../retrieve/types'
import { createFetchOptions } from '../../../utils/api'

export type ToDoItemUpdateFields = {
  name?: string
  description?: string
  dueDate?: number
  isDone?: boolean
  steps?: IStep[]
}

export const updateToDoItemFields = async (id: string, fields: ToDoItemUpdateFields, projectId?: string): Promise<void> => {
  const body = {
    id,
    ...fields,
  }

  const response = await fetch(`${API_BASE_URL}/todo_list/items/${id}`, createFetchOptions({
    method: 'PATCH',
    body: JSON.stringify(body),
  }, projectId))

  if (!response.ok) {
    throw new Error('Failed to update todo item')
  }
}