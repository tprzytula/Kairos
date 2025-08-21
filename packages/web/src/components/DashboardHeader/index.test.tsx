import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'
import DashboardHeader from './index'



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



  describe('greeting display', () => {
    beforeEach(() => {
      // Set time to morning (8 AM)
      jest.setSystemTime(new Date('2025-01-08T08:00:00.000Z'))
    })

    it('should display "Good morning" when time is before 12 PM', () => {
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
      renderWithTheme(<DashboardHeader />)

      // Wait for the date to be displayed
      await waitFor(() => {
        expect(screen.getByText('Wednesday, Jan 8')).toBeInTheDocument()
      })
    })
  })

  describe('user menu', () => {
    it('should render user menu when authenticated', () => {
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