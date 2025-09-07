import { renderHook } from '@testing-library/react'
import { useGroceryCategories } from './index'
import { GroceryViewMode, GroceryCategory } from '../../enums/groceryCategory'
import { GroceryItemUnit } from '../../enums/groceryItem'

const mockGroceryList = [
  {
    id: '1',
    name: 'Apple',
    quantity: 5,
    unit: GroceryItemUnit.UNIT,
    imagePath: '/path/to/apple.png',
    toBeRemoved: false,
    shopId: 'test-shop-1',
  },
  {
    id: '2',
    name: 'Milk',
    quantity: 1,
    unit: GroceryItemUnit.LITER,
    imagePath: '/path/to/milk.png',
    toBeRemoved: false,
    shopId: 'test-shop-1',
  },
  {
    id: '3',
    name: 'Bread',
    quantity: 2,
    unit: GroceryItemUnit.UNIT,
    imagePath: '/path/to/bread.png',
    toBeRemoved: false,
    shopId: 'test-shop-1',
  },
]

describe('useGroceryCategories', () => {
  it('should return empty array for categorizedGroups when view mode is uncategorized', () => {
    const { result } = renderHook(() =>
      useGroceryCategories(mockGroceryList, GroceryViewMode.UNCATEGORIZED)
    )

    expect(result.current.categorizedGroups).toEqual([])
  })

  it('should return categorized groups when view mode is categorized', () => {
    const { result } = renderHook(() =>
      useGroceryCategories(mockGroceryList, GroceryViewMode.CATEGORIZED)
    )

    expect(result.current.categorizedGroups).toBeDefined()
    expect(result.current.categorizedGroups.length).toBeGreaterThan(0)
  })

  it('should return alphabetical view when view mode is alphabetical', () => {
    const { result } = renderHook(() =>
      useGroceryCategories(mockGroceryList, GroceryViewMode.ALPHABETICAL)
    )

    expect(result.current.categorizedGroups).toBeDefined()
    expect(result.current.categorizedGroups.length).toBe(1)
    expect(result.current.categorizedGroups[0].label).toBe('All Items (A-Z)')
    expect(result.current.categorizedGroups[0].items).toHaveLength(mockGroceryList.length)
  })

  it('should categorize items correctly based on name matching', () => {
    const { result } = renderHook(() =>
      useGroceryCategories(mockGroceryList, GroceryViewMode.CATEGORIZED)
    )

    const groups = result.current.categorizedGroups
    expect(groups).toBeDefined()
    
    const produceGroup = groups.find(group => group.category === GroceryCategory.PRODUCE)
    expect(produceGroup).toBeDefined()
    expect(produceGroup!.items.some(item => item.name === 'Apple')).toBe(true)

    const dairyGroup = groups.find(group => group.category === GroceryCategory.DAIRY)
    expect(dairyGroup).toBeDefined()
    expect(dairyGroup!.items.some(item => item.name === 'Milk')).toBe(true)

    const bakeryGroup = groups.find(group => group.category === GroceryCategory.BAKERY)
    expect(bakeryGroup).toBeDefined()
    expect(bakeryGroup!.items.some(item => item.name === 'Bread')).toBe(true)
  })

  it('should return empty array when grocery list is empty', () => {
    const { result } = renderHook(() =>
      useGroceryCategories([], GroceryViewMode.CATEGORIZED)
    )

    expect(result.current.categorizedGroups).toEqual([])
  })
})