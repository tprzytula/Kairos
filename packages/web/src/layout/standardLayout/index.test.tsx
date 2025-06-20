import { render, screen } from "@testing-library/react"
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
    <StandardLayout 
      title="Title" 
      children={<div>Test</div>} 
    />
  )
}
