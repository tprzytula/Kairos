import { API_BASE_URL } from '../../index'
import { createFetchOptions } from '../../../utils/api'
import { GroceryItemUnit } from '../../../enums/groceryItem'

export interface IUpdateGroceryItemDefaultPayload {
  icon?: string
  unit?: GroceryItemUnit
  category?: string
}

export const updateGroceryItemDefault = async (
  name: string,
  payload: IUpdateGroceryItemDefaultPayload,
  projectId?: string
): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/grocery_list/items_defaults/${encodeURIComponent(name)}`,
    createFetchOptions(
      { method: 'PATCH', body: JSON.stringify(payload) },
      projectId
    )
  )

  if (!response.ok) {
    throw new Error('Failed to update grocery item default')
  }
}
