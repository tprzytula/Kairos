import { render, screen, fireEvent } from '@testing-library/react'
import UserMenu from './index'

// Mock the react-oidc-context hook
const mockAuthState = {
  user: {
    profile: {
      name: 'John Doe',
      email: 'john@example.com',
      picture: 'https://example.com/avatar.jpg' as string | undefined
    }
  } as any
}

const mockSignoutRedirect = jest.fn()
const mockUseAuth = jest.fn(() => ({
  ...mockAuthState,
  signoutRedirect: mockSignoutRedirect,
}))

jest.mock('react-oidc-context', () => ({
  useAuth: () => mockUseAuth(),
}))

describe('UserMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render user button', () => {
    render(<UserMenu />)
    
    expect(screen.getByRole('button')).toBeVisible()
  })

  it('should show dropdown when clicked', () => {
    render(<UserMenu />)
    
    fireEvent.click(screen.getByRole('button'))
    
    expect(screen.getByText('John Doe')).toBeVisible()
    expect(screen.getByText('john@example.com')).toBeVisible()
    expect(screen.getByRole('button', { name: /sign out/i })).toBeVisible()
  })

  it('should call signoutRedirect when logout is clicked', () => {
    render(<UserMenu />)
    
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByRole('button', { name: /sign out/i }))
    
    expect(mockSignoutRedirect).toHaveBeenCalledTimes(1)
  })

  it('should show user initials when no picture', () => {
    mockAuthState.user.profile.picture = undefined
    
    render(<UserMenu />)
    
    fireEvent.click(screen.getByRole('button'))
    
    expect(screen.getByText('J')).toBeVisible()
  })

  it('should not render when no user', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      signoutRedirect: mockSignoutRedirect,
    })
    
    const { container } = render(<UserMenu />)
    
    expect(container.firstChild).toBeNull()
  })
})
