import { render, screen } from "@testing-library/react"
import GroceryList from "."
import * as GroceryListProvider from '../../providers/GroceryListProvider'
import { IState } from "../../providers/GroceryListProvider/types"
import { GroceryItemUnit } from "../../enums/groceryItem"

describe('Given the GroceryList component', () => {
  it('should render the grocery list', () => {
    jest.spyOn(GroceryListProvider, 'useGroceryListContext').mockReturnValue(EXAMPLE_GROCERY_LIST_CONTEXT)

    render(<GroceryList />)

    expect(screen.getByText('Milk')).toBeVisible()
    expect(screen.getByText('Bread')).toBeVisible()
  })

  describe('When the grocery list is empty', () => {
    it('should render the empty list message', () => {
      jest.spyOn(GroceryListProvider, 'useGroceryListContext').mockReturnValue({
        groceryList: [],
        isLoading: false,
        refetchGroceryList: jest.fn(),
        removeGroceryItem: jest.fn(),
      })

      render(<GroceryList />)

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
      })

      render(<GroceryList />)

      expect(screen.getAllByLabelText('Grocery item placeholder')).toHaveLength(20)
    })
  })
})

const EXAMPLE_GROCERY_LIST_CONTEXT: IState = {
  groceryList: [
    {
      id: '1',
      name: 'Milk',
      quantity: 5,
      unit: GroceryItemUnit.LITER,
      imagePath: 'https://hostname.com/image.png',
    },
    {
      id: '2',
      name: 'Bread',
      quantity: 2,
      unit: GroceryItemUnit.UNIT,
      imagePath: 'https://hostname.com/image.png',
    },
  ],
  isLoading: false,
  refetchGroceryList: jest.fn(),
  removeGroceryItem: jest.fn(),
}
