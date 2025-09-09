import { renderHook } from '@testing-library/react'
import { useHomeData } from './index'
import { IGroceryItem } from '../../providers/AppStateProvider/types'
import { ITodoItem } from '../../api/toDoList/retrieve/types'
import { INoiseTrackingItem } from '../../api/noiseTracking'
import { GroceryItemUnit } from '../../enums/groceryItem'

const createMockGroceryItem = (overrides: Partial<IGroceryItem> = {}): IGroceryItem => ({
  id: 'grocery-1',
  name: 'Test Item',
  quantity: 1,
  shopId: 'test-shop',
  unit: GroceryItemUnit.UNIT,
  imagePath: '/test.png',
  toBeRemoved: false,
  ...overrides
})

const createMockTodoItem = (overrides: Partial<ITodoItem> = {}): ITodoItem => ({
  id: 'todo-1',
  name: 'Test Task',
  description: 'Test description',
  isDone: false,
  dueDate: undefined,
  ...overrides
})

const createMockNoiseItem = (timestamp: number): INoiseTrackingItem => ({
  timestamp
})

describe('useHomeData', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  beforeEach(() => {
    const mockDate = new Date('2024-01-15T12:00:00Z')
    jest.setSystemTime(mockDate)
  })

  const defaultProps = {
    groceryList: [],
    toDoList: [],
    noiseTrackingItems: [],
    purchasedItems: new Set<string>(),
    isToDoItemsExpanded: false
  }

  describe('groceryStats', () => {
    describe('when grocery list is empty', () => {
      it('should return empty stats', () => {
        const { result } = renderHook(() => useHomeData(defaultProps))

        expect(result.current.groceryStats).toEqual({
          totalItems: 0,
          unpurchasedItems: [],
          displayItems: [],
          hasOverflow: false
        })
      })
    })

    describe('when grocery list has items', () => {
      it('should calculate stats correctly for all unpurchased items', () => {
        const groceryList = [
          createMockGroceryItem({ id: '1', name: 'Item 1' }),
          createMockGroceryItem({ id: '2', name: 'Item 2' }),
          createMockGroceryItem({ id: '3', name: 'Item 3' })
        ]

        const { result } = renderHook(() => 
          useHomeData({ ...defaultProps, groceryList })
        )

        expect(result.current.groceryStats).toEqual({
          totalItems: 3,
          unpurchasedItems: groceryList,
          displayItems: groceryList,
          hasOverflow: false
        })
      })

      it('should filter out purchased items', () => {
        const groceryList = [
          createMockGroceryItem({ id: '1', name: 'Item 1' }),
          createMockGroceryItem({ id: '2', name: 'Item 2' }),
          createMockGroceryItem({ id: '3', name: 'Item 3' })
        ]
        const purchasedItems = new Set(['2'])

        const { result } = renderHook(() => 
          useHomeData({ ...defaultProps, groceryList, purchasedItems })
        )

        expect(result.current.groceryStats.totalItems).toBe(3)
        expect(result.current.groceryStats.unpurchasedItems).toHaveLength(2)
        expect(result.current.groceryStats.unpurchasedItems.map(item => item.id)).toEqual(['1', '3'])
      })

      it('should handle overflow when more than 10 unpurchased items', () => {
        const groceryList = Array.from({ length: 12 }, (_, index) =>
          createMockGroceryItem({ id: `${index + 1}`, name: `Item ${index + 1}` })
        )

        const { result } = renderHook(() => 
          useHomeData({ ...defaultProps, groceryList })
        )

        expect(result.current.groceryStats.totalItems).toBe(12)
        expect(result.current.groceryStats.unpurchasedItems).toHaveLength(12)
        expect(result.current.groceryStats.displayItems).toHaveLength(9)
        expect(result.current.groceryStats.hasOverflow).toBe(true)
      })
    })
  })

  describe('toDoStats', () => {
    describe('when todo list is empty', () => {
      it('should return empty stats', () => {
        const { result } = renderHook(() => useHomeData(defaultProps))

        expect(result.current.toDoStats).toEqual({
          pendingItems: [],
          sortedItems: [],
          displayedItems: [],
          hasMoreItems: false
        })
      })
    })

    describe('when todo list has items', () => {
      it('should filter out completed items', () => {
        const toDoList = [
          createMockTodoItem({ id: '1', name: 'Task 1', isDone: false }),
          createMockTodoItem({ id: '2', name: 'Task 2', isDone: true }),
          createMockTodoItem({ id: '3', name: 'Task 3', isDone: false })
        ]

        const { result } = renderHook(() => 
          useHomeData({ ...defaultProps, toDoList })
        )

        expect(result.current.toDoStats.pendingItems).toHaveLength(2)
        expect(result.current.toDoStats.pendingItems.map(item => item.id)).toEqual(['1', '3'])
      })

      it('should sort items by due date', () => {
        const tomorrow = new Date('2024-01-16T12:00:00Z').getTime()
        const nextWeek = new Date('2024-01-22T12:00:00Z').getTime()
        const today = new Date('2024-01-15T12:00:00Z').getTime()

        const toDoList = [
          createMockTodoItem({ id: '1', name: 'Task 1', dueDate: nextWeek }),
          createMockTodoItem({ id: '2', name: 'Task 2', dueDate: today }),
          createMockTodoItem({ id: '3', name: 'Task 3', dueDate: tomorrow }),
          createMockTodoItem({ id: '4', name: 'Task 4' }) // no due date
        ]

        const { result } = renderHook(() => 
          useHomeData({ ...defaultProps, toDoList })
        )

        expect(result.current.toDoStats.sortedItems.map(item => item.id)).toEqual(['2', '3', '1', '4'])
      })

      it('should limit displayed items to 3 when not expanded', () => {
        const toDoList = Array.from({ length: 5 }, (_, index) =>
          createMockTodoItem({ id: `${index + 1}`, name: `Task ${index + 1}` })
        )

        const { result } = renderHook(() => 
          useHomeData({ ...defaultProps, toDoList, isToDoItemsExpanded: false })
        )

        expect(result.current.toDoStats.displayedItems).toHaveLength(3)
        expect(result.current.toDoStats.hasMoreItems).toBe(true)
      })

      it('should show all items when expanded', () => {
        const toDoList = Array.from({ length: 5 }, (_, index) =>
          createMockTodoItem({ id: `${index + 1}`, name: `Task ${index + 1}` })
        )

        const { result } = renderHook(() => 
          useHomeData({ ...defaultProps, toDoList, isToDoItemsExpanded: true })
        )

        expect(result.current.toDoStats.displayedItems).toHaveLength(5)
        expect(result.current.toDoStats.hasMoreItems).toBe(true)
      })
    })
  })

  describe('noiseCounts', () => {
    describe('when noise tracking items are empty', () => {
      it('should return zero counts', () => {
        const { result } = renderHook(() => useHomeData(defaultProps))

        expect(result.current.noiseCounts).toEqual({
          todayCount: 0,
          last7DaysCount: 0,
          last30DaysCount: 0,
          totalCount: 0
        })
      })
    })

    describe('when noise tracking items exist', () => {
      it('should calculate today count correctly', () => {
        const todayTimestamp = new Date('2024-01-15T14:00:00Z').getTime()
        const yesterdayTimestamp = new Date('2024-01-14T14:00:00Z').getTime()
        
        const noiseTrackingItems = [
          createMockNoiseItem(todayTimestamp),
          createMockNoiseItem(todayTimestamp),
          createMockNoiseItem(yesterdayTimestamp)
        ]

        const { result } = renderHook(() => 
          useHomeData({ ...defaultProps, noiseTrackingItems })
        )

        expect(result.current.noiseCounts.todayCount).toBe(2)
      })

      it('should calculate last 7 days count correctly', () => {
        const todayTimestamp = new Date('2024-01-15T14:00:00Z').getTime()
        const threeDaysAgoTimestamp = new Date('2024-01-12T14:00:00Z').getTime()
        const tenDaysAgoTimestamp = new Date('2024-01-05T14:00:00Z').getTime()
        
        const noiseTrackingItems = [
          createMockNoiseItem(todayTimestamp),
          createMockNoiseItem(threeDaysAgoTimestamp),
          createMockNoiseItem(tenDaysAgoTimestamp)
        ]

        const { result } = renderHook(() => 
          useHomeData({ ...defaultProps, noiseTrackingItems })
        )

        expect(result.current.noiseCounts.last7DaysCount).toBe(2)
      })

      it('should calculate last 30 days count correctly', () => {
        const todayTimestamp = new Date('2024-01-15T14:00:00Z').getTime()
        const twoWeeksAgoTimestamp = new Date('2024-01-01T14:00:00Z').getTime()
        const twoMonthsAgoTimestamp = new Date('2023-11-15T14:00:00Z').getTime()
        
        const noiseTrackingItems = [
          createMockNoiseItem(todayTimestamp),
          createMockNoiseItem(twoWeeksAgoTimestamp),
          createMockNoiseItem(twoMonthsAgoTimestamp)
        ]

        const { result } = renderHook(() => 
          useHomeData({ ...defaultProps, noiseTrackingItems })
        )

        expect(result.current.noiseCounts.last30DaysCount).toBe(2)
        expect(result.current.noiseCounts.totalCount).toBe(3)
      })
    })
  })
})
