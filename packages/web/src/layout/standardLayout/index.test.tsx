import { render, screen } from "@testing-library/react"
import { ThemeProvider } from '@mui/material/styles'
import theme from '../../theme'
import StandardLayout from "."

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
  useLocation: jest.fn().mockReturnValue({
    pathname: '/',
  }),
}))

describe('Given the StandardLayout component', () => {
  it('should render the title', () => {
    renderStandardLayout()

    expect(screen.getByText('Title')).toBeVisible()
  })

  it('should render the children', () => {
    renderStandardLayout()

    expect(screen.getByText('Test')).toBeVisible()
  })

  describe('When centerVertically is not provided', () => {
    it('should use flex-start for content justification', () => {
      renderStandardLayout()

      const content = screen.getByText('Test').parentElement
      expect(content).toHaveStyle('justify-content: flex-start')
    })
  })

  describe('When centerVertically is false', () => {
    it('should use flex-start for content justification', () => {
      renderStandardLayout({ centerVertically: false })

      const content = screen.getByText('Test').parentElement
      expect(content).toHaveStyle('justify-content: flex-start')
    })
  })

  describe('When centerVertically is true', () => {
    it('should use center for content justification', () => {
      renderStandardLayout({ centerVertically: true })

      const content = screen.getByText('Test').parentElement
      expect(content).toHaveStyle('justify-content: center')
    })
  })
})

const renderStandardLayout = (props?: { centerVertically?: boolean }) => {
  render(
    <ThemeProvider theme={theme}>
      <StandardLayout 
        title="Title" 
        children={<div>Test</div>}
        {...props}
      />
    </ThemeProvider>
  )
}
