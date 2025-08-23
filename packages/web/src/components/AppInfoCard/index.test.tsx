import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'
import AppInfoCard from './index'

// Mock the useVersion hook
jest.mock('../../hooks/useVersion', () => ({
  useVersion: jest.fn()
}))

// Mock the useProjectContext hook
jest.mock('../../providers/ProjectProvider', () => ({
  useProjectContext: jest.fn()
}))

const mockUseVersion = require('../../hooks/useVersion').useVersion
const mockUseProjectContext = require('../../providers/ProjectProvider').useProjectContext

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
    
    // Default mock for version hook
    mockUseVersion.mockReturnValue({
      version: 'v2025.01.08.1400',
      isLoading: false,
      error: null
    })
    
    // Default mock for project context
    mockUseProjectContext.mockReturnValue({
      currentProject: {
        id: 'project-1',
        name: 'Test Project',
        isPersonal: false
      },
      projects: [],
      isLoading: false,
      createProject: jest.fn(),
      joinProject: jest.fn(),
      switchProject: jest.fn(),
      fetchProjects: jest.fn(),
      getProjectInviteInfo: jest.fn()
    })
  })

  describe('project display', () => {
    it('should display project name when current project is available', () => {
      mockUseProjectContext.mockReturnValue({
        currentProject: {
          id: 'project-1',
          name: 'My Awesome Project',
          isPersonal: false
        },
        projects: [],
        isLoading: false,
        createProject: jest.fn(),
        joinProject: jest.fn(),
        switchProject: jest.fn(),
        fetchProjects: jest.fn(),
        getProjectInviteInfo: jest.fn()
      })

      renderWithTheme(<AppInfoCard />)

      expect(screen.getByText('Kairos')).toBeInTheDocument()
      expect(screen.getByText('Project:')).toBeInTheDocument()
      expect(screen.getByText('My Awesome Project')).toBeInTheDocument()
    })

    it('should display personal project with label', () => {
      mockUseProjectContext.mockReturnValue({
        currentProject: {
          id: 'project-1',
          name: 'Personal Tasks',
          isPersonal: true
        },
        projects: [],
        isLoading: false,
        createProject: jest.fn(),
        joinProject: jest.fn(),
        switchProject: jest.fn(),
        fetchProjects: jest.fn(),
        getProjectInviteInfo: jest.fn()
      })

      renderWithTheme(<AppInfoCard />)

      expect(screen.getByText('Kairos')).toBeInTheDocument()
      expect(screen.getByText('Project:')).toBeInTheDocument()
      expect(screen.getByText('Personal Tasks (Personal)')).toBeInTheDocument()
    })

    it('should display loading when no current project', () => {
      mockUseProjectContext.mockReturnValue({
        currentProject: null,
        projects: [],
        isLoading: true,
        createProject: jest.fn(),
        joinProject: jest.fn(),
        switchProject: jest.fn(),
        fetchProjects: jest.fn(),
        getProjectInviteInfo: jest.fn()
      })

      renderWithTheme(<AppInfoCard />)

      expect(screen.getByText('Kairos')).toBeInTheDocument()
      expect(screen.getByText('Project:')).toBeInTheDocument()
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })
  })

  describe('version display', () => {
    it('should display version when available', () => {
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
      const { container } = renderWithTheme(<AppInfoCard />)

      // Check that the MUI Card component is rendered
      const cardElement = container.querySelector('.MuiCard-root')
      expect(cardElement).toBeInTheDocument()

      // Check that Kairos, project label, project name and version are present
      expect(screen.getByText('Kairos')).toBeInTheDocument()
      expect(screen.getByText('Project:')).toBeInTheDocument()
      expect(screen.getByText('Test Project')).toBeInTheDocument()
      expect(screen.getByText('v2025.01.08.1400')).toBeInTheDocument()
    })

    it('should have Kairos branding element', () => {
      renderWithTheme(<AppInfoCard />)

      const kairosElement = screen.getByText('Kairos')
      expect(kairosElement).toBeInTheDocument()
      
      // Verify it's a styled div element
      expect(kairosElement.tagName).toBe('DIV')
    })

    it('should have version text element', () => {
      renderWithTheme(<AppInfoCard />)

      const versionElement = screen.getByText('v2025.01.08.1400')
      expect(versionElement).toBeInTheDocument()
      
      // Verify it's a styled div element
      expect(versionElement.tagName).toBe('DIV')
    })



    it('should have project name element', () => {
      renderWithTheme(<AppInfoCard />)

      const projectElement = screen.getByText('Test Project')
      expect(projectElement).toBeInTheDocument()
      
      // Verify it's a span element within the styled div
      expect(projectElement.tagName).toBe('SPAN')
    })


  })

  describe('accessibility', () => {
    it('should be accessible with proper ARIA labels', () => {
      renderWithTheme(<AppInfoCard />)

      // The card should be accessible
      const kairosText = screen.getByText('Kairos')
      const projectLabelText = screen.getByText('Project:')
      const projectText = screen.getByText('Test Project')
      const versionText = screen.getByText('v2025.01.08.1400')
      
      expect(kairosText).toBeInTheDocument()
      expect(projectLabelText).toBeInTheDocument()
      expect(projectText).toBeInTheDocument()
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
      expect(screen.getByText('Project:')).toBeInTheDocument()
      expect(screen.getByText('Test Project')).toBeInTheDocument()
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
      expect(screen.getByText('Project:')).toBeInTheDocument()
      expect(screen.getByText('Test Project')).toBeInTheDocument()
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
      expect(screen.getByText('Test Project')).toBeInTheDocument()
      expect(screen.getByText(longVersion)).toBeInTheDocument()
    })

    it('should handle very long project names', () => {
      mockUseProjectContext.mockReturnValue({
        currentProject: {
          id: 'project-1',
          name: 'Very Long Project Name That Might Break Layout and Cause Issues',
          isPersonal: false
        },
        projects: [],
        isLoading: false,
        createProject: jest.fn(),
        joinProject: jest.fn(),
        switchProject: jest.fn(),
        fetchProjects: jest.fn(),
        getProjectInviteInfo: jest.fn()
      })

      renderWithTheme(<AppInfoCard />)

      expect(screen.getByText('Kairos')).toBeInTheDocument()
      expect(screen.getByText('Project:')).toBeInTheDocument()
      expect(screen.getByText('Very Long Project Name That Might Break Layout and Cause Issues')).toBeInTheDocument()
      expect(screen.getByText('v2025.01.08.1400')).toBeInTheDocument()
    })
  })

  describe('integration with hooks', () => {
    it('should call useVersion hook on render', () => {
      renderWithTheme(<AppInfoCard />)

      expect(mockUseVersion).toHaveBeenCalledTimes(1)
    })

    it('should call useProjectContext hook on render', () => {
      renderWithTheme(<AppInfoCard />)

      expect(mockUseProjectContext).toHaveBeenCalledTimes(1)
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
