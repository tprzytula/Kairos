import { render, screen, fireEvent } from '@testing-library/react'
import { useNavigate, useLocation } from 'react-router'
import ShopListRoute from '.'
import { useShopContext } from '../../providers/ShopProvider'
import { useAppState } from '../../providers/AppStateProvider'
import { Route } from '../../enums/route'

jest.mock('react-router', () => ({
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}))

jest.mock('../../providers/ShopProvider', () => ({
  ShopProvider: ({ children }: any) => children,
  useShopContext: jest.fn(),
}))

jest.mock('../../providers/AppStateProvider', () => ({
  useAppState: jest.fn(),
}))

jest.mock('../../components/ShopList', () => {
  return function MockShopList() {
    return <div data-testid="shop-list">Shop List</div>
  }
})

jest.mock('../../components/AddShopForm', () => {
  return function MockAddShopForm() {
    return <div data-testid="add-shop-form">Add Shop Form</div>
  }
})

jest.mock('../../components/EditShopForm', () => {
  return function MockEditShopForm() {
    return <div data-testid="edit-shop-form">Edit Shop Form</div>
  }
})

describe('Given the ShopListRoute component', () => {
  const mockNavigate = jest.fn()
  const mockDispatch = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useNavigate as jest.Mock).mockReturnValue(mockNavigate)
    ;(useLocation as jest.Mock).mockReturnValue({ search: '', pathname: '/shops' })
    ;(useAppState as jest.Mock).mockReturnValue({
      dispatch: mockDispatch,
    })
  })

  describe('When there are no shops with items', () => {
    beforeEach(() => {
      ;(useShopContext as jest.Mock).mockReturnValue({
        shops: [
          { id: 'shop1', name: 'Shop 1', itemCount: 0 },
          { id: 'shop2', name: 'Shop 2', itemCount: 0 },
        ],
        addShop: jest.fn(),
        updateShop: jest.fn(),
        deleteShop: jest.fn(),
      })
    })

    it('should not show the View All Items button', () => {
      render(<ShopListRoute />)

      expect(screen.queryByText('View All Items')).not.toBeInTheDocument()
    })

    it('should show the shop list', () => {
      render(<ShopListRoute />)

      expect(screen.getByTestId('shop-list')).toBeInTheDocument()
    })
  })

  describe('When there are shops with items', () => {
    beforeEach(() => {
      ;(useShopContext as jest.Mock).mockReturnValue({
        shops: [
          { id: 'shop1', name: 'Shop 1', itemCount: 5 },
          { id: 'shop2', name: 'Shop 2', itemCount: 3 },
        ],
        addShop: jest.fn(),
        updateShop: jest.fn(),
        deleteShop: jest.fn(),
      })
    })

    it('should show the View All Items button', () => {
      render(<ShopListRoute />)

      expect(screen.getByText('View All Items')).toBeInTheDocument()
    })

    it('should show the shopping cart icon with the button', () => {
      render(<ShopListRoute />)

      const button = screen.getByText('View All Items').closest('button')
      expect(button).toBeInTheDocument()
      
      // Check for shopping cart icon by looking for Material-UI icon
      const svgIcon = button?.querySelector('svg[data-testid="ShoppingCartIcon"]')
      expect(svgIcon).toBeInTheDocument()
    })

    it('should navigate to grocery list with "all" shopId when View All Items is clicked', () => {
      render(<ShopListRoute />)

      const viewAllButton = screen.getByText('View All Items')
      fireEvent.click(viewAllButton)

      expect(mockNavigate).toHaveBeenCalledWith('/groceries/all')
    })

    it('should show correct stats in header', () => {
      render(<ShopListRoute />)

      // Should show total shops: 2, total items: 8 (5 + 3)
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('8')).toBeInTheDocument()
    })
  })

  describe('When shops have undefined item counts', () => {
    beforeEach(() => {
      ;(useShopContext as jest.Mock).mockReturnValue({
        shops: [
          { id: 'shop1', name: 'Shop 1', itemCount: undefined },
          { id: 'shop2', name: 'Shop 2', itemCount: 3 },
        ],
        addShop: jest.fn(),
        updateShop: jest.fn(),
        deleteShop: jest.fn(),
      })
    })

    it('should still show the View All Items button if total items > 0', () => {
      render(<ShopListRoute />)

      expect(screen.getByText('View All Items')).toBeInTheDocument()
    })

    it('should handle undefined item counts as 0 in calculations', () => {
      render(<ShopListRoute />)

      // Should show total items: 3 (0 + 3, treating undefined as 0)
      expect(screen.getByText('3')).toBeInTheDocument()
    })
  })
})
