import { screen } from "@testing-library/react"
import ToDoItemPlaceholder from "."
import { renderWithTheme } from '../../../testUtils/renderWithTheme'

describe('Given the ToDoItemPlaceholder component', () => {
  it('should render the placeholder', () => {
    renderWithTheme(<ToDoItemPlaceholder />)

    expect(screen.getByLabelText('To do item placeholder')).toBeInTheDocument()
  })
})

