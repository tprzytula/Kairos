import { API_BASE_URL } from '../../index'
import { createFetchOptions } from '../../../utils/api'
import { GroceryItemUnit } from '../../../enums/groceryItem'

export interface IAddGroceryItemDefaultPayload {
  name: string
  icon?: string
  unit?: GroceryItemUnit
  category?: string
}

export const addGroceryItemDefault = async (
  payload: IAddGroceryItemDefaultPayload,
  projectId?: string
): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/grocery_list/items_defaults`,
    createFetchOptions(
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      projectId
    )
  )

  if (!response.ok) {
    throw new Error('Failed to add grocery item default')
  }
}
