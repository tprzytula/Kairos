import { render, screen } from "@testing-library/react"
import { BrowserRouter } from 'react-router'
import GroceryList from "."
import * as GroceryListProvider from '../../providers/GroceryListProvider'
import * as ReactRouter from 'react-router'
import { IState } from "../../providers/GroceryListProvider/types"
import { GroceryItemUnit } from "../../enums/groceryItem"
import { GroceryViewMode } from "../../enums/groceryCategory"

vi.mock('react-router', async () => ({
  ...(await vi.importActual('react-router')),
  useNavigate: vi.fn(),
}))

describe('Given the GroceryList component', () => {
  const mockNavigate = vi.fn()

  beforeEach(() => {
    vi.spyOn(ReactRouter, 'useNavigate').mockReturnValue(mockNavigate)
    mockNavigate.mockClear()
  })

  it('should render expand/collapse all toggle in categorized view', () => {
    vi.spyOn(GroceryListProvider, 'useGroceryListContext').mockReturnValue(EXAMPLE_GROCERY_LIST_CONTEXT)

    renderComponent()

    expect(screen.getAllByLabelText('Collapse')).toHaveLength(2)
  })

  it('should render the grocery list', () => {
    vi.spyOn(GroceryListProvider, 'useGroceryListContext').mockReturnValue(EXAMPLE_GROCERY_LIST_CONTEXT)

    renderComponent()

    expect(screen.getByText('Milk')).toBeVisible()
    expect(screen.getByText('Bread')).toBeVisible()
  })

  it('should pass navigate function correctly', () => {
    vi.spyOn(GroceryListProvider, 'useGroceryListContext').mockReturnValue(EXAMPLE_GROCERY_LIST_CONTEXT)

    renderComponent()

    expect(mockNavigate).toHaveBeenCalledTimes(0)
  })

  describe('When the viewMode is UNCATEGORIZED', () => {
    it('should render uncategorized view', () => {
      vi.spyOn(GroceryListProvider, 'useGroceryListContext').mockReturnValue({
        ...EXAMPLE_GROCERY_LIST_CONTEXT,
        viewMode: GroceryViewMode.UNCATEGORIZED,
      })
  
      renderComponent()
  
      expect(screen.getByText('Milk')).toBeVisible()
      expect(screen.getByText('Bread')).toBeVisible()
    })
  });

  describe('When the grocery list is empty', () => {
    it('should render the empty list icon and helpful text', () => {
      vi.spyOn(GroceryListProvider, 'useGroceryListContext').mockReturnValue({
        groceryList: [],
        isLoading: false,
        isError: false,
        isAllItemsView: false,
        viewMode: GroceryViewMode.CATEGORIZED,
        refetchGroceryList: vi.fn(),
        removeGroceryItem: vi.fn(),
        updateGroceryItem: vi.fn(),
        updateGroceryItemFields: vi.fn(),
        setViewMode: vi.fn(),
        removeCachedItems: vi.fn(),
        addItemToCache: vi.fn(),
      })

      renderComponent()

      expect(screen.getByLabelText('Empty grocery list')).toBeVisible()
      expect(screen.getByText('No grocery items found')).toBeVisible()
      expect(screen.getByText('Tap the + button to add your first item')).toBeVisible()
    })

    describe('Empty state layout behavior', () => {
      it('should center empty state vertically within available space', () => {
        vi.spyOn(GroceryListProvider, 'useGroceryListContext').mockReturnValue({
          groceryList: [],
          isLoading: false,
          isError: false,
          isAllItemsView: false,
          viewMode: GroceryViewMode.CATEGORIZED,
          refetchGroceryList: vi.fn(),
          removeGroceryItem: vi.fn(),
          updateGroceryItem: vi.fn(),
          updateGroceryItemFields: vi.fn(),
          setViewMode: vi.fn(),
          removeCachedItems: vi.fn(),
          addItemToCache: vi.fn(),
        })

        renderComponent()

        const emptyStateElement = screen.getByText('No grocery items found').parentElement
        expect(emptyStateElement).toBeInTheDocument()
        
        const computedStyle = window.getComputedStyle(emptyStateElement as Element)
        expect(computedStyle.display).toBe('flex')
        expect(computedStyle.flexDirection).toBe('column')
        expect(computedStyle.justifyContent).toBe('center')
        expect(computedStyle.alignItems).toBe('center')
        expect(computedStyle.flex).toBe('1 1 0%')
      })

      it('should maintain proper spacing and opacity in empty state', () => {
        vi.spyOn(GroceryListProvider, 'useGroceryListContext').mockReturnValue({
          groceryList: [],
          isLoading: false,
          isError: false,
          isAllItemsView: false,
          viewMode: GroceryViewMode.CATEGORIZED,
          refetchGroceryList: vi.fn(),
          removeGroceryItem: vi.fn(),
          updateGroceryItem: vi.fn(),
          updateGroceryItemFields: vi.fn(),
          setViewMode: vi.fn(),
          removeCachedItems: vi.fn(),
          addItemToCache: vi.fn(),
        })

        renderComponent()

        const emptyStateElement = screen.getByText('No grocery items found').parentElement
        const computedStyle = window.getComputedStyle(emptyStateElement as Element)
        
        expect(computedStyle.gap).toBe('12px')
        expect(computedStyle.opacity).toBe('0.6')
        expect(computedStyle.minHeight).toBe('300px')
      })
    })
  })

  describe('When the grocery list is loading', () => {
    it('should render the loading placeholder', () => {
      vi.spyOn(GroceryListProvider, 'useGroceryListContext').mockReturnValue({
        groceryList: [],
        isLoading: true,
        isError: false,
        isAllItemsView: false,
        viewMode: GroceryViewMode.CATEGORIZED,
        refetchGroceryList: vi.fn(),
        removeGroceryItem: vi.fn(),
        updateGroceryItem: vi.fn(),
        updateGroceryItemFields: vi.fn(),
        setViewMode: vi.fn(),
        removeCachedItems: vi.fn(),
        addItemToCache: vi.fn(),
      })

      renderComponent()

      expect(screen.getByLabelText('Loading grocery items')).toBeInTheDocument()
      expect(screen.getAllByLabelText('Grocery item placeholder')).toHaveLength(20)
    })
  })
})

const renderComponent = () => {
  render(
    <BrowserRouter>
      <GroceryList />
    </BrowserRouter>
  )
}

const EXAMPLE_GROCERY_LIST_CONTEXT: IState = {
  groceryList: [
    {
      id: '1',
      name: 'Milk',
      quantity: 5,
      unit: GroceryItemUnit.LITER,
      imagePath: 'https://hostname.com/image.png',
      toBeRemoved: false,
      shopId: 'test-shop-1',
    },
    {
      id: '2',
      name: 'Bread',
      quantity: 2,
      unit: GroceryItemUnit.UNIT,
      imagePath: 'https://hostname.com/image.png',
      toBeRemoved: false,
      shopId: 'test-shop-1',
    },
  ],
  isLoading: false,
  isError: false,
  isAllItemsView: false,
  viewMode: GroceryViewMode.CATEGORIZED,
  refetchGroceryList: vi.fn(),
  removeGroceryItem: vi.fn(),
  updateGroceryItem: vi.fn(),
  updateGroceryItemFields: vi.fn(),
  setViewMode: vi.fn(),
  removeCachedItems: vi.fn(),
  addItemToCache: vi.fn(),
}
