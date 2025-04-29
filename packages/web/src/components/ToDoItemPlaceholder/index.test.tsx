import { render, screen } from "@testing-library/react"
import ToDoItemPlaceholder from "."

describe('Given the ToDoItemPlaceholder component', () => {
  it('should render the placeholder', () => {
    render(<ToDoItemPlaceholder />)

    expect(screen.getByLabelText('To do item placeholder')).toBeInTheDocument()
  })
})
