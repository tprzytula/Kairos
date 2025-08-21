import { render, screen, fireEvent } from '@testing-library/react'
import LoginScreen from './index'

// Mock the react-oidc-context hook
const mockSigninRedirect = jest.fn()
jest.mock('react-oidc-context', () => ({
  useAuth: () => ({
    signinRedirect: mockSigninRedirect,
  }),
}))

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the welcome screen', () => {
    render(<LoginScreen />)
    
    expect(screen.getByText('Welcome to Kairos')).toBeVisible()
    expect(screen.getByText('Your Personal Productivity Hub')).toBeVisible()
    expect(screen.getByText('Manage your grocery lists, todo items, and track your daily activities all in one place')).toBeVisible()
  })

  it('should render feature list', () => {
    render(<LoginScreen />)
    
    expect(screen.getByText('Smart Grocery Lists')).toBeVisible()
    expect(screen.getByText('Task Management')).toBeVisible()
    expect(screen.getByText('Noise Tracking')).toBeVisible()
    expect(screen.getByText('Sync Across Devices')).toBeVisible()
  })

  it('should render Google login button', () => {
    render(<LoginScreen />)
    
    const loginButton = screen.getByRole('button', { name: /continue with google/i })
    expect(loginButton).toBeVisible()
  })

  it('should call signinRedirect when login button is clicked', () => {
    render(<LoginScreen />)
    
    const loginButton = screen.getByRole('button', { name: /continue with google/i })
    fireEvent.click(loginButton)
    
    expect(mockSigninRedirect).toHaveBeenCalledTimes(1)
  })

  it('should render security text', () => {
    render(<LoginScreen />)
    
    expect(screen.getByText('Secure authentication powered by Google OAuth')).toBeVisible()
  })
})
