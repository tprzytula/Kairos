import { render, screen } from "@testing-library/react"
import StandardLayout from "."
import { Route } from "../../enums/route"

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
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

  it('should render the back button', () => {
    renderStandardLayout()

    expect(screen.getByLabelText('Back Button')).toBeVisible()
  })

  it('should render the next button', () => {
    renderStandardLayout()

    expect(screen.getByLabelText('Navigate to route')).toBeVisible()
  })
})

const renderStandardLayout = () => {
  render(
    <StandardLayout 
      title="Title" 
      children={<div>Test</div>} 
      nextRoute={Route.GroceryList} 
      previousRoute={Route.Home} 
    />
  )
}
