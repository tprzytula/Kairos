import React from 'react'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import theme from '../../theme'
import GroceryItemPreviewPopup from './index'
import { IGroceryItem } from '../../providers/AppStateProvider/types'
import { GroceryItemUnit } from '../../enums/groceryItem'

const mockGroceryItem: IGroceryItem = {
  id: '1',
  name: 'Apples',
  quantity: 5,
  unit: GroceryItemUnit.KILOGRAM,
  imagePath: '/test-image.jpg',
  toBeRemoved: false
}

const mockGroceryItemWithoutImage: IGroceryItem = {
  id: '2',
  name: 'Milk',
  quantity: 2,
  unit: GroceryItemUnit.LITER,
  toBeRemoved: false
}

const mockAnchorPosition = {
  top: 100,
  left: 200,
  arrowOffset: 0
}

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('GroceryItemPreviewPopup component', () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
  })

  afterEach(() => {
    cleanup()
  })

  describe('when popup is closed', () => {
    it('should not render when open is false', () => {
      renderWithTheme(
        <GroceryItemPreviewPopup
          open={false}
          onClose={mockOnClose}
          item={mockGroceryItem}
          anchorPosition={mockAnchorPosition}
        />
      )

      expect(screen.queryByText('Apples')).not.toBeInTheDocument()
    })

    it('should not render when item is null', () => {
      renderWithTheme(
        <GroceryItemPreviewPopup
          open={true}
          onClose={mockOnClose}
          item={null}
          anchorPosition={mockAnchorPosition}
        />
      )

      expect(screen.queryByText('Apples')).not.toBeInTheDocument()
    })

    it('should not render when anchorPosition is not provided', () => {
      renderWithTheme(
        <GroceryItemPreviewPopup
          open={true}
          onClose={mockOnClose}
          item={mockGroceryItem}
        />
      )

      expect(screen.queryByText('Apples')).not.toBeInTheDocument()
    })
  })

  describe('when bubble is open with item', () => {
    it('should display item name and quantity with unit', () => {
      renderWithTheme(
        <GroceryItemPreviewPopup
          open={true}
          onClose={mockOnClose}
          item={mockGroceryItem}
          anchorPosition={mockAnchorPosition}
        />
      )

      expect(screen.getByText('Apples')).toBeInTheDocument()
      expect(screen.getByText('5 kg')).toBeInTheDocument()
    })

    it('should display clean bubble without duplicate image', () => {
      renderWithTheme(
        <GroceryItemPreviewPopup
          open={true}
          onClose={mockOnClose}
          item={mockGroceryItem}
          anchorPosition={mockAnchorPosition}
        />
      )

      // Should not show duplicate image since it's already visible in the clicked icon
      const itemImageContainer = document.body.querySelector('[style*="background-image"]')
      expect(itemImageContainer).toBeNull()
      
      // Should still show the text content
      expect(screen.getByText('Apples')).toBeInTheDocument()
      expect(screen.getByText('5 kg')).toBeInTheDocument()
    })

    it('should render bubble when open with all required elements', () => {
      renderWithTheme(
        <GroceryItemPreviewPopup
          open={true}
          onClose={mockOnClose}
          item={mockGroceryItem}
          anchorPosition={mockAnchorPosition}
        />
      )

      // Check that all required elements are rendered
      expect(screen.getByRole('tooltip')).toBeInTheDocument()
      expect(screen.getByText('Apples')).toBeInTheDocument()
      expect(screen.getByText('5 kg')).toBeInTheDocument()
    })

    it('should have tooltip role and proper aria attributes', () => {
      renderWithTheme(
        <GroceryItemPreviewPopup
          open={true}
          onClose={mockOnClose}
          item={mockGroceryItem}
          anchorPosition={mockAnchorPosition}
        />
      )

      const tooltip = screen.getByRole('tooltip')
      expect(tooltip).toHaveAttribute('aria-label', 'Apples - 5 kg')
    })

    it('should position bubble according to anchor position', () => {
      renderWithTheme(
        <GroceryItemPreviewPopup
          open={true}
          onClose={mockOnClose}
          item={mockGroceryItem}
          anchorPosition={mockAnchorPosition}
        />
      )

      const bubble = document.body.querySelector('[role="tooltip"]')
      expect(bubble).toHaveStyle(`top: ${mockAnchorPosition.top}px`)
      expect(bubble).toHaveStyle(`left: ${mockAnchorPosition.left}px`)
    })

    it('should handle arrow offset for edge positioning', () => {
      const edgeAnchorPosition = {
        top: 100,
        left: 50,
        arrowOffset: 30
      }
      
      renderWithTheme(
        <GroceryItemPreviewPopup
          open={true}
          onClose={mockOnClose}
          item={mockGroceryItem}
          anchorPosition={edgeAnchorPosition}
        />
      )

      const bubble = document.body.querySelector('[role="tooltip"]')
      expect(bubble).toBeInTheDocument()
      // Arrow offset is handled via styled component props
    })
  })

  describe('accessibility', () => {
    it('should have proper tooltip role and aria label', () => {
      renderWithTheme(
        <GroceryItemPreviewPopup
          open={true}
          onClose={mockOnClose}
          item={mockGroceryItem}
          anchorPosition={mockAnchorPosition}
        />
      )

      const tooltip = screen.getByRole('tooltip')
      expect(tooltip).toHaveAttribute('aria-label', 'Apples - 5 kg')
    })

    it('should work with different item units', () => {
      renderWithTheme(
        <GroceryItemPreviewPopup
          open={true}
          onClose={mockOnClose}
          item={mockGroceryItemWithoutImage}
          anchorPosition={mockAnchorPosition}
        />
      )

      const tooltip = screen.getByRole('tooltip')
      expect(tooltip).toHaveAttribute('aria-label', 'Milk - 2 l')
    })
  })
})
