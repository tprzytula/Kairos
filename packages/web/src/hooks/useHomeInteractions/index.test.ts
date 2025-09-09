import { renderHook, act } from '@testing-library/react'
import { useHomeInteractions } from './index'
import { IGroceryItem } from '../../providers/AppStateProvider/types'
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

const createMockMouseEvent = (rect: DOMRect): React.MouseEvent<HTMLDivElement> => {
  return {
    currentTarget: {
      getBoundingClientRect: () => rect
    }
  } as unknown as React.MouseEvent<HTMLDivElement>
}

Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 768
})

Object.defineProperty(window, 'scrollX', {
  writable: true,
  configurable: true,
  value: 0
})

Object.defineProperty(window, 'scrollY', {
  writable: true,
  configurable: true,
  value: 0
})

describe('useHomeInteractions', () => {
  beforeEach(() => {
    window.innerWidth = 768
    window.scrollX = 0
    window.scrollY = 0
  })

  describe('initial state', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useHomeInteractions())

      expect(result.current.selectedGroceryItem).toBeNull()
      expect(result.current.isPopupOpen).toBe(false)
      expect(result.current.anchorPosition).toBeUndefined()
      expect(result.current.isToDoItemsExpanded).toBe(false)
      expect(result.current.noiseView).toBe('overview')
      expect(result.current.expandedToDoItems).toEqual(new Set())
    })
  })

  describe('handleGroceryItemClick', () => {
    describe('when clicking on grocery item', () => {
      it('should open popup with correct item and position', () => {
        const { result } = renderHook(() => useHomeInteractions())
        const item = createMockGroceryItem({ id: '1', name: 'Test Item' })
        const rect = new DOMRect(100, 200, 50, 50)
        const event = createMockMouseEvent(rect)

        act(() => {
          result.current.handleGroceryItemClick(item, event)
        })

        expect(result.current.selectedGroceryItem).toBe(item)
        expect(result.current.isPopupOpen).toBe(true)
        expect(result.current.anchorPosition).toBeDefined()
        expect(result.current.anchorPosition!.top).toBe(258) // 200 + 50 + 8
        expect(result.current.anchorPosition!.left).toBe(136) // adjusted center position
      })

      it('should calculate arrow offset when bubble needs repositioning', () => {
        const { result } = renderHook(() => useHomeInteractions())
        const item = createMockGroceryItem()
        
        window.innerWidth = 300
        const rect = new DOMRect(10, 200, 50, 50) // Very close to left edge
        const event = createMockMouseEvent(rect)

        act(() => {
          result.current.handleGroceryItemClick(item, event)
        })

        expect(result.current.anchorPosition!.arrowOffset).toBeDefined()
        expect(result.current.anchorPosition!.arrowOffset).not.toBe(0)
      })

      it('should handle edge case positioning', () => {
        const { result } = renderHook(() => useHomeInteractions())
        const item = createMockGroceryItem()
        
        window.innerWidth = 768
        const rect = new DOMRect(700, 200, 50, 50) // Close to right edge
        const event = createMockMouseEvent(rect)

        act(() => {
          result.current.handleGroceryItemClick(item, event)
        })

        expect(result.current.anchorPosition).toBeDefined()
        expect(result.current.anchorPosition!.left).toBeLessThan(window.innerWidth - 16)
      })
    })
  })

  describe('handlePopupClose', () => {
    describe('when popup is open', () => {
      it('should close popup and clear state', () => {
        const { result } = renderHook(() => useHomeInteractions())
        const item = createMockGroceryItem()
        const rect = new DOMRect(100, 200, 50, 50)
        const event = createMockMouseEvent(rect)

        act(() => {
          result.current.handleGroceryItemClick(item, event)
        })

        expect(result.current.isPopupOpen).toBe(true)

        act(() => {
          result.current.handlePopupClose()
        })

        expect(result.current.selectedGroceryItem).toBeNull()
        expect(result.current.isPopupOpen).toBe(false)
        expect(result.current.anchorPosition).toBeUndefined()
      })
    })
  })

  describe('handleToggleToDoItems', () => {
    describe('when toggling expansion state', () => {
      it('should toggle from collapsed to expanded', () => {
        const { result } = renderHook(() => useHomeInteractions())

        expect(result.current.isToDoItemsExpanded).toBe(false)

        act(() => {
          result.current.handleToggleToDoItems()
        })

        expect(result.current.isToDoItemsExpanded).toBe(true)
      })

      it('should toggle from expanded to collapsed', () => {
        const { result } = renderHook(() => useHomeInteractions())

        act(() => {
          result.current.handleToggleToDoItems()
          result.current.handleToggleToDoItems()
        })

        expect(result.current.isToDoItemsExpanded).toBe(false)
      })
    })
  })

  describe('handleNoiseViewChange', () => {
    describe('when changing noise view', () => {
      it('should update noise view to "today"', () => {
        const { result } = renderHook(() => useHomeInteractions())

        act(() => {
          result.current.handleNoiseViewChange('today')
        })

        expect(result.current.noiseView).toBe('today')
      })

      it('should update noise view to "last7days"', () => {
        const { result } = renderHook(() => useHomeInteractions())

        act(() => {
          result.current.handleNoiseViewChange('last7days')
        })

        expect(result.current.noiseView).toBe('last7days')
      })

      it('should update noise view to "last30days"', () => {
        const { result } = renderHook(() => useHomeInteractions())

        act(() => {
          result.current.handleNoiseViewChange('last30days')
        })

        expect(result.current.noiseView).toBe('last30days')
      })

      it('should update noise view back to "overview"', () => {
        const { result } = renderHook(() => useHomeInteractions())

        act(() => {
          result.current.handleNoiseViewChange('last7days')
          result.current.handleNoiseViewChange('overview')
        })

        expect(result.current.noiseView).toBe('overview')
      })
    })
  })

  describe('handleToDoItemToggle', () => {
    describe('when toggling todo item expansion', () => {
      it('should add item to expanded set', () => {
        const { result } = renderHook(() => useHomeInteractions())

        act(() => {
          result.current.handleToDoItemToggle('item-1')
        })

        expect(result.current.expandedToDoItems.has('item-1')).toBe(true)
      })

      it('should remove item from expanded set when already expanded', () => {
        const { result } = renderHook(() => useHomeInteractions())

        act(() => {
          result.current.handleToDoItemToggle('item-1')
          result.current.handleToDoItemToggle('item-1')
        })

        expect(result.current.expandedToDoItems.has('item-1')).toBe(false)
      })

      it('should handle multiple items in expanded set', () => {
        const { result } = renderHook(() => useHomeInteractions())

        act(() => {
          result.current.handleToDoItemToggle('item-1')
          result.current.handleToDoItemToggle('item-2')
          result.current.handleToDoItemToggle('item-3')
        })

        expect(result.current.expandedToDoItems.has('item-1')).toBe(true)
        expect(result.current.expandedToDoItems.has('item-2')).toBe(true)
        expect(result.current.expandedToDoItems.has('item-3')).toBe(true)
        expect(result.current.expandedToDoItems.size).toBe(3)
      })

      it('should maintain other items when toggling one item', () => {
        const { result } = renderHook(() => useHomeInteractions())

        act(() => {
          result.current.handleToDoItemToggle('item-1')
          result.current.handleToDoItemToggle('item-2')
          result.current.handleToDoItemToggle('item-1') // Remove item-1
        })

        expect(result.current.expandedToDoItems.has('item-1')).toBe(false)
        expect(result.current.expandedToDoItems.has('item-2')).toBe(true)
        expect(result.current.expandedToDoItems.size).toBe(1)
      })
    })
  })
})
