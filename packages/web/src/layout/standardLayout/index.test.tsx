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
})

const renderStandardLayout = () => {
  render(
    <ThemeProvider theme={theme}>
      <StandardLayout 
        title="Title" 
        children={<div>Test</div>} 
      />
    </ThemeProvider>
  )
}
