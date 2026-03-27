import { IGroceryItem } from '../../providers/AppStateProvider/types'

export const mergeGroceryItem = (items: IGroceryItem[], item: IGroceryItem): IGroceryItem[] => {
  const existingIndex = items.findIndex((i) => i.id === item.id)
  if (existingIndex !== -1) {
    const updated = [...items]
    updated[existingIndex] = { ...updated[existingIndex], quantity: updated[existingIndex].quantity + item.quantity }
    return updated
  }
  return [...items, item]
}
