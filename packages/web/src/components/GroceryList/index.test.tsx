import { render, screen } from "@testing-library/react"
import GroceryList from "."
import * as GroceryListProvider from '../../providers/GroceryListProvider'
import { IState } from "../../providers/GroceryListProvider/types"

describe('Given the GroceryList component', () => {
  it('should render the grocery list', () => {
    jest.spyOn(GroceryListProvider, 'useGroceryListContext').mockReturnValue(EXAMPLE_GROCERY_LIST_CONTEXT)

    render(<GroceryList />)

    expect(screen.getByText('Milk')).toBeVisible()
    expect(screen.getByText('Bread')).toBeVisible()
  })
})

const EXAMPLE_GROCERY_LIST_CONTEXT: IState = {
  groceryList: [
    {
      id: '1',
      name: 'Milk',
      quantity: 5,
    },
    {
      id: '2',
      name: 'Bread',
      quantity: 2,
    },
  ],
}
