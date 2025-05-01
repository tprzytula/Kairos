import { render, screen } from "@testing-library/react"
import GroceryList from "."

describe('Given the GroceryList component', () => {
  it('should render the grocery list', () => {
    render(<GroceryList groceryList={[
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
    ]} />)

    expect(screen.getByText('Milk')).toBeVisible()
    expect(screen.getByText('Bread')).toBeVisible()
  })
})
