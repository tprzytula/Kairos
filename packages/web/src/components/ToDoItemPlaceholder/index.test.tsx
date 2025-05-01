import { render, screen } from "@testing-library/react"
import ToDoItemPlaceholder from "."
import { ThemeProvider, createTheme } from "@mui/material/styles"

describe('Given the ToDoItemPlaceholder component', () => {
  it('should render the placeholder', () => {
    renderWithTheme(<ToDoItemPlaceholder />)

    expect(screen.getByLabelText('To do item placeholder')).toBeInTheDocument()
  })
})

const theme = createTheme()

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

