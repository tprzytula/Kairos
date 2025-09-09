import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import theme from '../../../../theme'
import { GrocerySection } from './index'
import { IGroceryItem } from '../../../../providers/AppStateProvider/types'
import { IGroceryStats } from '../../../../hooks/useHomeData/types'
import { GroceryItemUnit } from '../../../../enums/groceryItem'

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

const createMockGroceryStats = (overrides: Partial<IGroceryStats> = {}): IGroceryStats => ({
  totalItems: 0,
  unpurchasedItems: [],
  displayItems: [],
  hasOverflow: false,
  ...overrides
})

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('GrocerySection component', () => {
  const mockOnGroceryItemClick = jest.fn()

  beforeEach(() => {
    mockOnGroceryItemClick.mockClear()
  })

  describe('when loading', () => {
    it('should show loading placeholder', () => {
      const groceryStats = createMockGroceryStats()
      
      renderWithTheme(
        <GrocerySection
          groceryStats={groceryStats}
          isLoading={true}
          onGroceryItemClick={mockOnGroceryItemClick}
        />
      )
      
      expect(screen.getByText('Grocery List')).toBeInTheDocument()
      expect(screen.getByText('0')).toBeInTheDocument()
    })
  })

  describe('when no grocery items exist', () => {
    it('should show empty state message', () => {
      const groceryStats = createMockGroceryStats()
      
      renderWithTheme(
        <GrocerySection
          groceryStats={groceryStats}
          isLoading={false}
          onGroceryItemClick={mockOnGroceryItemClick}
        />
      )
      
      expect(screen.getByText('No grocery items found')).toBeInTheDocument()
    })
  })

  describe('when grocery items exist', () => {
    it('should display grocery items grid', () => {
      const items = [
        createMockGroceryItem({ id: '1', name: 'Item 1' }),
        createMockGroceryItem({ id: '2', name: 'Item 2' }),
        createMockGroceryItem({ id: '3', name: 'Item 3' })
      ]
      
      const groceryStats = createMockGroceryStats({
        totalItems: 3,
        unpurchasedItems: items,
        displayItems: items,
        hasOverflow: false
      })
      
      renderWithTheme(
        <GrocerySection
          groceryStats={groceryStats}
          isLoading={false}
          onGroceryItemClick={mockOnGroceryItemClick}
        />
      )
      
      expect(screen.getByText('Grocery List')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
      expect(screen.getByTitle('Item 1 (1 unit(s))')).toBeInTheDocument()
      expect(screen.getByTitle('Item 2 (1 unit(s))')).toBeInTheDocument()
      expect(screen.getByTitle('Item 3 (1 unit(s))')).toBeInTheDocument()
    })

    it('should show correct item count in header', () => {
      const items = Array.from({ length: 5 }, (_, i) => 
        createMockGroceryItem({ id: `${i + 1}`, name: `Item ${i + 1}` })
      )
      
      const groceryStats = createMockGroceryStats({
        totalItems: 5,
        unpurchasedItems: items,
        displayItems: items,
        hasOverflow: false
      })
      
      renderWithTheme(
        <GrocerySection
          groceryStats={groceryStats}
          isLoading={false}
          onGroceryItemClick={mockOnGroceryItemClick}
        />
      )
      
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('should handle grocery item clicks', () => {
      const item = createMockGroceryItem({ id: '1', name: 'Clickable Item' })
      const groceryStats = createMockGroceryStats({
        totalItems: 1,
        unpurchasedItems: [item],
        displayItems: [item],
        hasOverflow: false
      })
      
      renderWithTheme(
        <GrocerySection
          groceryStats={groceryStats}
          isLoading={false}
          onGroceryItemClick={mockOnGroceryItemClick}
        />
      )
      
      const itemElement = screen.getByTitle('Clickable Item (1 unit(s))')
      fireEvent.click(itemElement)
      
      expect(mockOnGroceryItemClick).toHaveBeenCalledTimes(1)
      expect(mockOnGroceryItemClick).toHaveBeenCalledWith(item, expect.any(Object))
    })

    it('should show overflow indicator when items exceed display limit', () => {
      const allItems = Array.from({ length: 12 }, (_, i) => 
        createMockGroceryItem({ id: `${i + 1}`, name: `Item ${i + 1}` })
      )
      
      const groceryStats = createMockGroceryStats({
        totalItems: 12,
        unpurchasedItems: allItems,
        displayItems: allItems.slice(0, 9),
        hasOverflow: true
      })
      
      renderWithTheme(
        <GrocerySection
          groceryStats={groceryStats}
          isLoading={false}
          onGroceryItemClick={mockOnGroceryItemClick}
        />
      )
      
      expect(screen.getByText('+3')).toBeInTheDocument()
      expect(screen.getByTitle('+3 more items')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have proper ARIA labels', () => {
      const item = createMockGroceryItem({ 
        id: '1', 
        name: 'Accessible Item',
        quantity: 2,
        unit: GroceryItemUnit.KILOGRAM
      })
      
      const groceryStats = createMockGroceryStats({
        totalItems: 1,
        unpurchasedItems: [item],
        displayItems: [item],
        hasOverflow: false
      })
      
      renderWithTheme(
        <GrocerySection
          groceryStats={groceryStats}
          isLoading={false}
          onGroceryItemClick={mockOnGroceryItemClick}
        />
      )
      
      expect(screen.getByTitle('Accessible Item (2 kg)')).toBeInTheDocument()
    })
  })
})
