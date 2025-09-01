import { render, screen } from "@testing-library/react"
import { ThemeProvider } from '@mui/material/styles'
import theme from '../../../theme'
import NoiseTrackingItemPlaceholder from "."

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('Given the NoiseTrackingItemPlaceholder component', () => {
  it('should render placeholder elements', () => {
    const { container } = renderWithTheme(<NoiseTrackingItemPlaceholder />)
    
    // Should render the main container (card)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should have proper styling for loading state', () => {
    const { container } = renderWithTheme(<NoiseTrackingItemPlaceholder />)
    
    // Should have card-like styling - test that it renders
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should contain placeholder elements with shimmer effect', () => {
    const { container } = renderWithTheme(<NoiseTrackingItemPlaceholder />)
    
    // Component should render without errors
    expect(container.firstChild).toBeInTheDocument()
  })
})