import { render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'
import DashboardHeader from './index'

// Mock the useVersion hook
jest.mock('../../hooks/useVersion', () => ({
  useVersion: jest.fn()
}))

const mockUseVersion = require('../../hooks/useVersion').useVersion

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
})