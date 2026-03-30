import { describe, it, expect } from 'vitest'
import { upsertGroceryItem } from './upsertGroceryItem'
import { IGroceryItem } from '../../providers/AppStateProvider/types'
import { GroceryItemUnit } from '../../enums/groceryItem'

const makeItem = (overrides: Partial<IGroceryItem> = {}): IGroceryItem => ({
  id: 'item-1',
  name: 'Milk',
  quantity: 2,
  unit: GroceryItemUnit.LITER,
  shopId: 'shop-1',
  imagePath: '',
  toBeRemoved: false,
  ...overrides,
})

describe('upsertGroceryItem', () => {
  it('appends item when id does not exist in list', () => {
    const existing = [makeItem({ id: 'item-1' })]
    const result = upsertGroceryItem(existing, makeItem({ id: 'item-2', quantity: 3 }))

    expect(result).toHaveLength(2)
    expect(result[1]).toMatchObject({ id: 'item-2', quantity: 3 })
  })

  it('adds quantity to existing item when id matches', () => {
    const existing = [makeItem({ id: 'item-1', quantity: 2 })]
    const result = upsertGroceryItem(existing, makeItem({ id: 'item-1', quantity: 3 }))

    expect(result).toHaveLength(1)
    expect(result[0].quantity).toBe(5)
  })

  it('preserves other fields of existing item when merging', () => {
    const existing = [makeItem({ id: 'item-1', name: 'Milk', quantity: 1 })]
    const result = upsertGroceryItem(existing, makeItem({ id: 'item-1', name: 'Milk', quantity: 2 }))

    expect(result[0]).toMatchObject({ id: 'item-1', name: 'Milk', quantity: 3 })
  })

  it('does not mutate the original list', () => {
    const existing = [makeItem({ id: 'item-1', quantity: 1 })]
    upsertGroceryItem(existing, makeItem({ id: 'item-1', quantity: 1 }))

    expect(existing[0].quantity).toBe(1)
  })
})
