import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'
import AppInfoCard from './index'

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

describe('AppInfoCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('version display', () => {
    it('should display version when available', () => {
      mockUseVersion.mockReturnValue({
        version: 'v2025.01.08.1400',
        isLoading: false,
        error: null
      })

      renderWithTheme(<AppInfoCard />)

      expect(screen.getByText('Kairos')).toBeInTheDocument()
      expect(screen.getByText('v2025.01.08.1400')).toBeInTheDocument()
    })

    it('should display localhost when running locally', () => {
      mockUseVersion.mockReturnValue({
        version: 'localhost',
        isLoading: false,
        error: null
      })

      renderWithTheme(<AppInfoCard />)

      expect(screen.getByText('Kairos')).toBeInTheDocument()
      expect(screen.getByText('localhost')).toBeInTheDocument()
    })

    it('should display ... when version is loading', () => {
      mockUseVersion.mockReturnValue({
        version: null,
        isLoading: true,
        error: null
      })

      renderWithTheme(<AppInfoCard />)

      expect(screen.getByText('Kairos')).toBeInTheDocument()
      expect(screen.getByText('...')).toBeInTheDocument()
    })

    it('should display ... when version is not available', () => {
      mockUseVersion.mockReturnValue({
        version: null,
        isLoading: false,
        error: null
      })

      renderWithTheme(<AppInfoCard />)

      expect(screen.getByText('Kairos')).toBeInTheDocument()
      expect(screen.getByText('...')).toBeInTheDocument()
    })

    it('should display ... when version fetch fails', () => {
      mockUseVersion.mockReturnValue({
        version: null,
        isLoading: false,
        error: 'Failed to load version'
      })

      renderWithTheme(<AppInfoCard />)

      expect(screen.getByText('Kairos')).toBeInTheDocument()
      expect(screen.getByText('...')).toBeInTheDocument()
    })
  })

  describe('layout and styling', () => {
    it('should render with proper structure', () => {
      mockUseVersion.mockReturnValue({
        version: 'v2025.01.08.1400',
        isLoading: false,
        error: null
      })

      const { container } = renderWithTheme(<AppInfoCard />)

      // Check that the MUI Card component is rendered
      const cardElement = container.querySelector('.MuiCard-root')
      expect(cardElement).toBeInTheDocument()

      // Check that both Kairos and version are present
      expect(screen.getByText('Kairos')).toBeInTheDocument()
      expect(screen.getByText('v2025.01.08.1400')).toBeInTheDocument()
    })

    it('should have Kairos branding element', () => {
      mockUseVersion.mockReturnValue({
        version: 'v2025.01.08.1400',
        isLoading: false,
        error: null
      })

      renderWithTheme(<AppInfoCard />)

      const kairosElement = screen.getByText('Kairos')
      expect(kairosElement).toBeInTheDocument()
      
      // Verify it's a styled div element
      expect(kairosElement.tagName).toBe('DIV')
    })

    it('should have version text element', () => {
      mockUseVersion.mockReturnValue({
        version: 'v2025.01.08.1400',
        isLoading: false,
        error: null
      })

      renderWithTheme(<AppInfoCard />)

      const versionElement = screen.getByText('v2025.01.08.1400')
      expect(versionElement).toBeInTheDocument()
      
      // Verify it's a styled div element
      expect(versionElement.tagName).toBe('DIV')
    })
  })

  describe('accessibility', () => {
    it('should be accessible with proper ARIA labels', () => {
      mockUseVersion.mockReturnValue({
        version: 'v2025.01.08.1400',
        isLoading: false,
        error: null
      })

      renderWithTheme(<AppInfoCard />)

      // The card should be accessible
      const kairosText = screen.getByText('Kairos')
      const versionText = screen.getByText('v2025.01.08.1400')
      
      expect(kairosText).toBeInTheDocument()
      expect(versionText).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('should handle undefined version gracefully', () => {
      mockUseVersion.mockReturnValue({
        version: undefined,
        isLoading: false,
        error: null
      })

      renderWithTheme(<AppInfoCard />)

      expect(screen.getByText('Kairos')).toBeInTheDocument()
      expect(screen.getByText('...')).toBeInTheDocument()
    })

    it('should handle empty string version', () => {
      mockUseVersion.mockReturnValue({
        version: '',
        isLoading: false,
        error: null
      })

      renderWithTheme(<AppInfoCard />)

      expect(screen.getByText('Kairos')).toBeInTheDocument()
      expect(screen.getByText('...')).toBeInTheDocument()
    })

    it('should handle very long version strings', () => {
      const longVersion = 'v2025.01.08.1400.extra.long.version.string.that.might.break.layout'
      
      mockUseVersion.mockReturnValue({
        version: longVersion,
        isLoading: false,
        error: null
      })

      renderWithTheme(<AppInfoCard />)

      expect(screen.getByText('Kairos')).toBeInTheDocument()
      expect(screen.getByText(longVersion)).toBeInTheDocument()
    })
  })

  describe('integration with useVersion hook', () => {
    it('should call useVersion hook on render', () => {
      mockUseVersion.mockReturnValue({
        version: 'v2025.01.08.1400',
        isLoading: false,
        error: null
      })

      renderWithTheme(<AppInfoCard />)

      expect(mockUseVersion).toHaveBeenCalledTimes(1)
    })

    it('should re-render when version changes', () => {
      const { rerender } = renderWithTheme(<AppInfoCard />)

      // First render with loading state
      mockUseVersion.mockReturnValue({
        version: null,
        isLoading: true,
        error: null
      })

      rerender(
        <ThemeProvider theme={theme}>
          <AppInfoCard />
        </ThemeProvider>
      )

      expect(screen.getByText('...')).toBeInTheDocument()

      // Second render with version loaded
      mockUseVersion.mockReturnValue({
        version: 'v2025.01.08.1400',
        isLoading: false,
        error: null
      })

      rerender(
        <ThemeProvider theme={theme}>
          <AppInfoCard />
        </ThemeProvider>
      )

      expect(screen.getByText('v2025.01.08.1400')).toBeInTheDocument()
    })
  })
})
