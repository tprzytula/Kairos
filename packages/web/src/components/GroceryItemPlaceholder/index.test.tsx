import { render, screen } from "@testing-library/react"
import GroceryItemPlaceholder from "."

describe('Given the GroceryItemPlaceholder component', () => {
  it('should render the placeholder', () => {
    render(<GroceryItemPlaceholder />)

    expect(screen.getByLabelText('Grocery item placeholder')).toBeInTheDocument()
  })
})
