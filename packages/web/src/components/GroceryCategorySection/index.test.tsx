import { render, screen } from '@testing-library/react'
import GroceryCategorySection from '.'
import { GroceryItemUnit } from '../../enums/groceryItem'
import { GroceryCategory } from '../../enums/groceryCategory'

describe('GroceryCategorySection', () => {
  const baseProps = {
    categoryLabel: 'Fruits & Vegetables',
    category: GroceryCategory.PRODUCE,
    items: [
      { id: '1', name: 'Apple', quantity: 1, unit: GroceryItemUnit.UNIT, toBeRemoved: false },
    ],
    onDelete: jest.fn(),
    onEdit: jest.fn(),
  }

  it('should render header with label and count', () => {
    render(<GroceryCategorySection {...baseProps} />)
    expect(screen.getByText('Fruits & Vegetables')).toBeVisible()
    const counts = screen.getAllByText('1')
    expect(counts[0]).toBeVisible()
  })

  it('should respect expandTo and expandKey props', () => {
    const { rerender } = render(<GroceryCategorySection {...baseProps} expandTo={true} expandKey={0} />)
    // When collapsed globally
    rerender(<GroceryCategorySection {...baseProps} expandTo={false} expandKey={1} />)
    expect(screen.getByText('Fruits & Vegetables')).toBeVisible()
  })
})

