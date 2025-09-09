import { API_BASE_URL } from '../../index'
import { createFetchOptions } from '../../../utils/api'
import { GroceryItemUpdateFields } from '../types'

export const updateGroceryItem = async (id: string, quantity: number, projectId?: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/grocery_list/items/${id}`, createFetchOptions({
    method: 'PATCH',
    body: JSON.stringify({ id, quantity: quantity.toString() }),
  }, projectId))

  if (!response.ok) {
    throw new Error('Failed to update grocery item')
  }
}

export const updateGroceryItemFields = async (id: string, fields: GroceryItemUpdateFields, projectId?: string): Promise<void> => {
  const body = {
    id,
    ...fields,
    quantity: fields.quantity?.toString(),
  }

  const response = await fetch(`${API_BASE_URL}/grocery_list/items/${id}`, createFetchOptions({
    method: 'PATCH',
    body: JSON.stringify(body),
  }, projectId))

  if (!response.ok) {
    throw new Error('Failed to update grocery item')
  }
} 