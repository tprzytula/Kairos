import { render, screen } from "@testing-library/react"
import { BrowserRouter } from 'react-router'
import GroceryList from "."
import * as GroceryListProvider from '../../providers/GroceryListProvider'
import * as ReactRouter from 'react-router'
import { IState } from "../../providers/GroceryListProvider/types"
import { GroceryItemUnit } from "../../enums/groceryItem"

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
}))

describe('Given the GroceryList component', () => {
  const mockNavigate = jest.fn()

  beforeEach(() => {
    jest.spyOn(ReactRouter, 'useNavigate').mockReturnValue(mockNavigate)
    mockNavigate.mockClear()
  })

  it('should render the grocery list', () => {
    jest.spyOn(GroceryListProvider, 'useGroceryListContext').mockReturnValue(EXAMPLE_GROCERY_LIST_CONTEXT)

    renderComponent()

    expect(screen.getByText('Milk')).toBeVisible()
    expect(screen.getByText('Bread')).toBeVisible()
  })

  it('should pass navigate function correctly', () => {
    jest.spyOn(GroceryListProvider, 'useGroceryListContext').mockReturnValue(EXAMPLE_GROCERY_LIST_CONTEXT)

    renderComponent()

    expect(mockNavigate).toHaveBeenCalledTimes(0)
  })

  describe('When the grocery list is empty', () => {
    it('should render the empty list message', () => {
      jest.spyOn(GroceryListProvider, 'useGroceryListContext').mockReturnValue({
        groceryList: [],
        isLoading: false,
        refetchGroceryList: jest.fn(),
        removeGroceryItem: jest.fn(),
        updateGroceryItem: jest.fn(),
        updateGroceryItemFields: jest.fn(),
      })

      renderComponent()

      expect(screen.getByText('No items in your grocery list')).toBeVisible()
    })
  })

  describe('When the grocery list is loading', () => {
    it('should render the loading placeholder', () => {
      jest.spyOn(GroceryListProvider, 'useGroceryListContext').mockReturnValue({
        groceryList: [],
        isLoading: true,
        refetchGroceryList: jest.fn(),
        removeGroceryItem: jest.fn(),
        updateGroceryItem: jest.fn(),
        updateGroceryItemFields: jest.fn(),
      })

      renderComponent()

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
    },
    {
      id: '2',
      name: 'Bread',
      quantity: 2,
      unit: GroceryItemUnit.UNIT,
      imagePath: 'https://hostname.com/image.png',
      toBeRemoved: false,
    },
  ],
  isLoading: false,
  refetchGroceryList: jest.fn(),
  removeGroceryItem: jest.fn(),
  updateGroceryItem: jest.fn(),
  updateGroceryItemFields: jest.fn(),
}
