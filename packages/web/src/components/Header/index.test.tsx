import { render, screen } from "@testing-library/react"
import Header from "./index"

describe('Given the Header component', () => {
  it('should render the header', () => {
    render(<Header title="Grocery List" />)

    expect(screen.getByText('Grocery List')).toBeVisible()
  })
})
