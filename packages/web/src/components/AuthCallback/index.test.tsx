import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router'
import AuthCallback from './index'

// Mock the react-oidc-context hook
const mockAuthState = {
  isAuthenticated: false,
  error: null as any,
}

const mockUseAuth = jest.fn(() => mockAuthState)

jest.mock('react-oidc-context', () => ({
  useAuth: () => mockUseAuth(),
}))

// Mock useNavigate
const mockNavigate = jest.fn()
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockNavigate,
}))

const renderAuthCallback = () => {
  return render(
    <BrowserRouter>
      <AuthCallback />
    </BrowserRouter>
  )
}

describe('AuthCallback', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    Object.assign(mockAuthState, {
      isAuthenticated: false,
      error: null,
    })
  })

  it('should render loading state by default', () => {
    renderAuthCallback()
    
    expect(screen.getByText('Completing authentication...')).toBeVisible()
  })

  it('should render error state when there is an error', () => {
    mockAuthState.error = { message: 'Authentication failed' }
    
    renderAuthCallback()
    
    expect(screen.getByText('Authentication Error')).toBeVisible()
    expect(screen.getByText('Authentication failed')).toBeVisible()
  })

  it('should navigate to home when authenticated', () => {
    mockAuthState.isAuthenticated = true
    
    renderAuthCallback()
    
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('should navigate to home when there is an error', () => {
    mockAuthState.error = { message: 'Authentication failed' }
    
    renderAuthCallback()
    
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})
