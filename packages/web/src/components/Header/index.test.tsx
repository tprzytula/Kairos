import { render, screen } from "@testing-library/react"
import { ThemeProvider } from '@mui/material/styles'
import theme from '../../theme'
import Header from "./index"

describe('Given the Header component', () => {
  it('should render the header', () => {
    render(
      <ThemeProvider theme={theme}>
        <Header title="Grocery List" />
      </ThemeProvider>
    )

    expect(screen.getByText('Grocery List')).toBeVisible()
  })
})
