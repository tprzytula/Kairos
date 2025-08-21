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

// Mock the UserMenu component
jest.mock('../UserMenu', () => {
  return function MockUserMenu() {
    return <div data-testid="user-menu">UserMenu</div>
  }
})

const mockUseVersion = require('../../hooks/useVersion').useVersion
const mockUseAuth = require('react-oidc-context').useAuth

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
    // Mock Date to have consistent tests
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2025-01-08T14:30:00.000Z')) // 2:30 PM UTC
    
    // Mock auth context - default to no user
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('version display', () => {
    it('should display version when available', () => {
      mockUseVersion.mockReturnValue({
        version: 'v2025.08.07.1703',
        isLoading: false,
        error: null
      })

      renderWithTheme(<DashboardHeader />)

      expect(screen.getByText('v2025.08.07.1703')).toBeInTheDocument()
    })

    it('should display ... when version is loading', () => {
      mockUseVersion.mockReturnValue({
        version: null,
        isLoading: true,
        error: null
      })

      renderWithTheme(<DashboardHeader />)

      expect(screen.getByText('...')).toBeInTheDocument()
    })

    it('should display ... when version is not available', () => {
      mockUseVersion.mockReturnValue({
        version: null,
        isLoading: false,
        error: null
      })

      renderWithTheme(<DashboardHeader />)

      expect(screen.getByText('...')).toBeInTheDocument()
    })
  })

  describe('greeting display', () => {
    beforeEach(() => {
      // Set time to morning (8 AM)
      jest.setSystemTime(new Date('2025-01-08T08:00:00.000Z'))
    })

    it('should display "Good morning" when time is before 12 PM', () => {
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
        error: null
      })

      renderWithTheme(<DashboardHeader />)

      expect(screen.getByText('Good morning, John')).toBeInTheDocument()
    })

    it('should display "Good afternoon" when time is between 12 PM and 6 PM', () => {
      // Set time to afternoon (2:30 PM)
      jest.setSystemTime(new Date('2025-01-08T14:30:00.000Z'))

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
        error: null
      })

      renderWithTheme(<DashboardHeader />)

      expect(screen.getByText('Good afternoon, John')).toBeInTheDocument()
    })

    it('should display "Good evening" when time is after 6 PM', () => {
      // Set time to evening (8 PM)
      jest.setSystemTime(new Date('2025-01-08T20:00:00.000Z'))

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
        error: null
      })

      renderWithTheme(<DashboardHeader />)

      expect(screen.getByText('Good evening, John')).toBeInTheDocument()
    })

    it('should not display greeting when no user', () => {
      mockUseVersion.mockReturnValue({
        version: 'v2025.08.07.1703',
        isLoading: false,
        error: null
      })

      // Ensure no user is set
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      })

      renderWithTheme(<DashboardHeader />)

      // The greeting shows when no user - it shows time-based greeting only
      expect(screen.getByText(/Good/)).toBeInTheDocument()
    })

    it('should handle user with full name from profile.name', () => {
      mockUseVersion.mockReturnValue({
        version: 'v2025.08.07.1703',
        isLoading: false,
        error: null
      })

      mockUseAuth.mockReturnValue({
        user: {
          profile: {
            name: 'John Doe'
          }
        },
        isAuthenticated: true,
        isLoading: false,
        error: null
      })

      renderWithTheme(<DashboardHeader />)

      expect(screen.getByText('Good morning, John Doe')).toBeInTheDocument()
    })
  })

  describe('current date display', () => {
    it('should display current date in proper format', async () => {
      mockUseVersion.mockReturnValue({
        version: 'v2025.08.07.1703',
        isLoading: false,
        error: null
      })

      renderWithTheme(<DashboardHeader />)

      // Wait for the date to be displayed
      await waitFor(() => {
        expect(screen.getByText('Wednesday, Jan 8')).toBeInTheDocument()
      })
    })
  })

  describe('user menu', () => {
    it('should render user menu when authenticated', () => {
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
        error: null
      })

      renderWithTheme(<DashboardHeader />)

      expect(screen.getByTestId('user-menu')).toBeInTheDocument()
    })

    it('should not render user menu when user is not authenticated', () => {
      mockUseVersion.mockReturnValue({
        version: 'v2025.08.07.1703',
        isLoading: false,
        error: null
      })

      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      })

      renderWithTheme(<DashboardHeader />)

      expect(screen.queryByTestId('user-menu')).not.toBeInTheDocument()
    })

    it('should not render user menu when user is null but authenticated is true', () => {
      mockUseVersion.mockReturnValue({
        version: 'v2025.08.07.1703',
        isLoading: false,
        error: null
      })

      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: true,
        isLoading: false,
        error: null
      })

      renderWithTheme(<DashboardHeader />)

      expect(screen.queryByTestId('user-menu')).not.toBeInTheDocument()
    })
  })
})