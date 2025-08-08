import { GROCERY_LIST_API_URL } from '..'
import { GroceryItemUnit } from '../../../enums/groceryItem'

export type GroceryItemUpdateFields = {
  name?: string
  quantity?: number
  unit?: GroceryItemUnit
  imagePath?: string
}

export const updateGroceryItem = async (id: string, quantity: number): Promise<void> => {
  const response = await fetch(`${GROCERY_LIST_API_URL}/grocery_list/items/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ id, quantity: quantity.toString() }),
  })

  if (!response.ok) {
    throw new Error('Failed to update grocery item')
  }
}

export const updateGroceryItemFields = async (id: string, fields: GroceryItemUpdateFields): Promise<void> => {
  const body = {
    id,
    ...fields,
    quantity: fields.quantity?.toString(),
  }

  const response = await fetch(`${GROCERY_LIST_API_URL}/grocery_list/items/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error('Failed to update grocery item')
  }
} 