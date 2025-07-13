import { GROCERY_LIST_API_URL } from '..'

export const updateGroceryItem = async (id: string, quantity: number): Promise<void> => {
  const response = await fetch(`${GROCERY_LIST_API_URL}/grocery_list/items/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ id, quantity: quantity.toString() }),
  })

  if (!response.ok) {
    throw new Error('Failed to update grocery item')
  }
} 