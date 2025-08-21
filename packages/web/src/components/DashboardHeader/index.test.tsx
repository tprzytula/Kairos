import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'
import DashboardHeader from './index'

// Mock the useVersion hook
jest.mock('../../hooks/useVersion', () => ({
  useVersion: jest.fn()
}))

// Mock the useAuth hook
jest.mock('react-oidc-context', () => ({
  useAuth: jest.fn()
}))

const mockUseVersion = require('../../hooks/useVersion').useVersion
const mockUseAuth = require('react-oidc-context').useAuth
const mockSignoutRedirect = jest.fn()

const theme = createTheme()

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('DashboardHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSignoutRedirect.mockClear()
    // Mock Date to have consistent tests
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2025-01-08T14:30:00.000Z')) // 2:30 PM UTC
    
    // Mock auth context - default to no user
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      signoutRedirect: mockSignoutRedirect
    })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should render greeting based on time of day', () => {
    mockUseVersion.mockReturnValue({
      version: '2025.08.07.1703',
      isLoading: false,
      error: null
    })

    renderWithTheme(<DashboardHeader />)

    expect(screen.getByText('Good afternoon')).toBeInTheDocument()
  })

  it('should render current date', () => {
    mockUseVersion.mockReturnValue({
      version: '2025.08.07.1703',
      isLoading: false,
      error: null
    })

    renderWithTheme(<DashboardHeader />)

    expect(screen.getByText('Wednesday, Jan 8')).toBeInTheDocument()
  })

  it('should render app branding', () => {
    mockUseVersion.mockReturnValue({
      version: '2025.08.07.1703',
      isLoading: false,
      error: null
    })

    renderWithTheme(<DashboardHeader />)

    expect(screen.getByText('Kairos')).toBeInTheDocument()
  })

  it('should display version when loaded', async () => {
    mockUseVersion.mockReturnValue({
      version: 'v2025.08.07.1703',
      isLoading: false,
      error: null
    })

    renderWithTheme(<DashboardHeader />)

    await waitFor(() => {
      expect(screen.getByText('v2025.08.07.1703')).toBeInTheDocument()
    })
  })

  it('should display loading state while version is being fetched', () => {
    mockUseVersion.mockReturnValue({
      version: null,
      isLoading: true,
      error: null
    })

    renderWithTheme(<DashboardHeader />)

    expect(screen.getByText('...')).toBeInTheDocument()
  })

  it('should display fallback when version fails to load', () => {
    mockUseVersion.mockReturnValue({
      version: null,
      isLoading: false,
      error: 'Failed to load version'
    })

    renderWithTheme(<DashboardHeader />)

    expect(screen.getByText('...')).toBeInTheDocument()
  })

  it('should display localhost when running locally', async () => {
    mockUseVersion.mockReturnValue({
      version: 'localhost',
      isLoading: false,
      error: null
    })

    renderWithTheme(<DashboardHeader />)

    await waitFor(() => {
      expect(screen.getByText('localhost')).toBeInTheDocument()
    })
  })

  describe('time-based greetings', () => {
    it('should show "Good morning" for morning hours', () => {
      jest.setSystemTime(new Date('2025-01-08T09:00:00.000Z')) // 9 AM UTC
      
      mockUseVersion.mockReturnValue({
        version: 'v2025.08.07.1703',
        isLoading: false,
        error: null
      })

      renderWithTheme(<DashboardHeader />)

      expect(screen.getByText('Good morning')).toBeInTheDocument()
    })

    it('should show "Good afternoon" for afternoon hours', () => {
      jest.setSystemTime(new Date('2025-01-08T15:00:00.000Z')) // 3 PM UTC
      
      mockUseVersion.mockReturnValue({
        version: 'v2025.08.07.1703',
        isLoading: false,
        error: null
      })

      renderWithTheme(<DashboardHeader />)

      expect(screen.getByText('Good afternoon')).toBeInTheDocument()
    })

    it('should show "Good evening" for evening hours', () => {
      jest.setSystemTime(new Date('2025-01-08T20:00:00.000Z')) // 8 PM UTC
      
      mockUseVersion.mockReturnValue({
        version: 'v2025.08.07.1703',
        isLoading: false,
        error: null
      })

      renderWithTheme(<DashboardHeader />)

      expect(screen.getByText('Good evening')).toBeInTheDocument()
    })
  })

  describe('authenticated user state', () => {
    it('should render personalized greeting when user is authenticated', () => {
      mockUseVersion.mockReturnValue({
        version: 'v2025.08.07.1703',
        isLoading: false,
        error: null
      })

      mockUseAuth.mockReturnValue({
        user: {
          profile: {
            given_name: 'John',
            family_name: 'Doe',
            name: 'John Doe',
            email: 'john.doe@example.com',
            picture: 'https://example.com/avatar.jpg'
          }
        },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        signoutRedirect: mockSignoutRedirect
      })

      renderWithTheme(<DashboardHeader />)

      expect(screen.getByText('Good afternoon, John')).toBeInTheDocument()
    })

    it('should render user avatar when authenticated', () => {
      mockUseVersion.mockReturnValue({
        version: 'v2025.08.07.1703',
        isLoading: false,
        error: null
      })

      mockUseAuth.mockReturnValue({
        user: {
          profile: {
            given_name: 'John',
            picture: 'https://example.com/avatar.jpg'
          }
        },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        signoutRedirect: mockSignoutRedirect
      })

      renderWithTheme(<DashboardHeader />)

      const avatar = screen.getByAltText('Profile')
      expect(avatar).toBeInTheDocument()
      expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg')
    })

    it('should render fallback icon when no avatar picture', () => {
      mockUseVersion.mockReturnValue({
        version: 'v2025.08.07.1703',
        isLoading: false,
        error: null
      })

      mockUseAuth.mockReturnValue({
        user: {
          profile: {
            given_name: 'John'
          }
        },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        signoutRedirect: mockSignoutRedirect
      })

      renderWithTheme(<DashboardHeader />)

      expect(screen.getByTestId('PersonIcon')).toBeInTheDocument()
    })
  })

  describe('logout functionality', () => {
    it('should call signoutRedirect when profile picture is clicked', () => {
      mockUseVersion.mockReturnValue({
        version: 'v2025.08.07.1703',
        isLoading: false,
        error: null
      })

      mockUseAuth.mockReturnValue({
        user: {
          profile: {
            given_name: 'John',
            picture: 'https://example.com/avatar.jpg'
          }
        },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        signoutRedirect: mockSignoutRedirect
      })

      renderWithTheme(<DashboardHeader />)

      const avatarButton = screen.getByRole('button', { name: /profile/i })
      fireEvent.click(avatarButton)

      expect(mockSignoutRedirect).toHaveBeenCalledTimes(1)
    })

    it('should call signoutRedirect when profile picture without image is clicked', () => {
      mockUseVersion.mockReturnValue({
        version: 'v2025.08.07.1703',
        isLoading: false,
        error: null
      })

      mockUseAuth.mockReturnValue({
        user: {
          profile: {
            given_name: 'John'
          }
        },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        signoutRedirect: mockSignoutRedirect
      })

      renderWithTheme(<DashboardHeader />)

      const avatarButton = screen.getByRole('button', { name: /click to log out/i })
      fireEvent.click(avatarButton)

      expect(mockSignoutRedirect).toHaveBeenCalledTimes(1)
    })

    it('should have proper accessibility attributes for profile avatar', () => {
      mockUseVersion.mockReturnValue({
        version: 'v2025.08.07.1703',
        isLoading: false,
        error: null
      })

      mockUseAuth.mockReturnValue({
        user: {
          profile: {
            given_name: 'John',
            picture: 'https://example.com/avatar.jpg'
          }
        },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        signoutRedirect: mockSignoutRedirect
      })

      renderWithTheme(<DashboardHeader />)

      const avatarButton = screen.getByRole('button', { name: /profile/i })
      
      expect(avatarButton).toHaveAttribute('tabIndex', '0')
      expect(avatarButton).toHaveAttribute('title', 'Click to log out')
      expect(avatarButton).toBeInTheDocument()
    })

    it('should support keyboard navigation for logout', () => {
      mockUseVersion.mockReturnValue({
        version: 'v2025.08.07.1703',
        isLoading: false,
        error: null
      })

      mockUseAuth.mockReturnValue({
        user: {
          profile: {
            given_name: 'John',
            picture: 'https://example.com/avatar.jpg'
          }
        },
        isAuthenticated: true,
        isLoading: false,
        error: null,
        signoutRedirect: mockSignoutRedirect
      })

      renderWithTheme(<DashboardHeader />)

      const avatarButton = screen.getByRole('button', { name: /profile/i })
      
      // Focus and press Enter
      avatarButton.focus()
      fireEvent.keyDown(avatarButton, { key: 'Enter', code: 'Enter' })

      expect(mockSignoutRedirect).toHaveBeenCalledTimes(1)
    })

    it('should not render logout button when user is not authenticated', () => {
      mockUseVersion.mockReturnValue({
        version: 'v2025.08.07.1703',
        isLoading: false,
        error: null
      })

      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        signoutRedirect: mockSignoutRedirect
      })

      renderWithTheme(<DashboardHeader />)

      expect(screen.queryByRole('button', { name: /profile/i })).not.toBeInTheDocument()
      expect(screen.queryByAltText('Profile')).not.toBeInTheDocument()
    })
  })
})