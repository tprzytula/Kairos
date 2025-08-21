import { render, screen } from '@testing-library/react'
import ProtectedRoute from './index'

// Mock the react-oidc-context hook
const mockAuthState = {
  isLoading: false,
  isAuthenticated: false,
  error: null as any,
  user: null,
}

const mockUseAuth = jest.fn(() => mockAuthState)

jest.mock('react-oidc-context', () => ({
  useAuth: () => mockUseAuth(),
}))

// Mock LoginScreen component
jest.mock('../LoginScreen', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="login-screen">Login Screen</div>,
  }
})

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    Object.assign(mockAuthState, {
      isLoading: false,
      isAuthenticated: false,
      error: null,
      user: null,
    })
  })

  it('should render loading state when auth is loading', () => {
    mockAuthState.isLoading = true
    
    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    )
    
    expect(screen.getByText('Loading...')).toBeVisible()
    expect(screen.queryByTestId('protected-content')).toBeNull()
    expect(screen.queryByTestId('login-screen')).toBeNull()
  })

  it('should render error state when auth has error', () => {
    mockAuthState.error = { message: 'Authentication failed' }
    
    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    )
    
    expect(screen.getByText('Authentication Error')).toBeVisible()
    expect(screen.getByText('Authentication failed')).toBeVisible()
    expect(screen.queryByTestId('protected-content')).toBeNull()
    expect(screen.queryByTestId('login-screen')).toBeNull()
  })

  it('should render login screen when not authenticated', () => {
    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    )
    
    expect(screen.getByTestId('login-screen')).toBeVisible()
    expect(screen.queryByTestId('protected-content')).toBeNull()
  })

  it('should render protected content when authenticated', () => {
    mockAuthState.isAuthenticated = true
    
    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    )
    
    expect(screen.getByTestId('protected-content')).toBeVisible()
    expect(screen.queryByTestId('login-screen')).toBeNull()
    expect(screen.queryByText('Loading...')).toBeNull()
  })
})
