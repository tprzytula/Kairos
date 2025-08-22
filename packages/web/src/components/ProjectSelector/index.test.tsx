import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'
import ProjectSelector from './index'

const theme = createTheme()

const mockProjects = [
  {
    id: 'personal-project',
    ownerId: 'test-user-id',
    name: 'Personal Project',
    isPersonal: true,
    maxMembers: 1,
    inviteCode: 'invite-123',
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'shared-project',
    ownerId: 'other-user-id',
    name: 'Shared Project',
    isPersonal: false,
    maxMembers: 5,
    inviteCode: 'invite-456',
    createdAt: '2023-01-02T00:00:00Z'
  }
]

const mockProjectContext = {
  projects: mockProjects,
  currentProject: mockProjects[0],
  isLoading: false,
  createProject: jest.fn(),
  joinProject: jest.fn(),
  switchProject: jest.fn(),
  fetchProjects: jest.fn(),
  getProjectInviteInfo: jest.fn()
}

const mockUseProjectContext = jest.fn()

jest.mock('../../providers/ProjectProvider', () => ({
  useProjectContext: () => mockUseProjectContext(),
}))

const renderProjectSelector = (props = {}) => {
  return render(
    <ThemeProvider theme={theme}>
      <ProjectSelector {...props} />
    </ThemeProvider>
  )
}

describe('ProjectSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseProjectContext.mockReturnValue(mockProjectContext)
  })

  it('should render project selector with current project selected', () => {
    renderProjectSelector()

    expect(screen.getByText('Personal Project (Personal)')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('should show all projects in dropdown', () => {
    renderProjectSelector()

    const select = screen.getByRole('combobox')
    fireEvent.mouseDown(select)

    expect(screen.getAllByText('Personal Project (Personal)')).toHaveLength(2)
    expect(screen.getByText('Shared Project')).toBeInTheDocument()
  })

  it('should call switchProject when project is selected', () => {
    renderProjectSelector()

    const select = screen.getByRole('combobox')
    fireEvent.mouseDown(select)

    const sharedProjectOption = screen.getByRole('option', { name: 'Shared Project' })
    fireEvent.click(sharedProjectOption)

    expect(mockProjectContext.switchProject).toHaveBeenCalledWith('shared-project')
  })

  it('should call onProjectSelect callback when provided', () => {
    const onProjectSelect = jest.fn()
    renderProjectSelector({ onProjectSelect })

    const select = screen.getByRole('combobox')
    fireEvent.mouseDown(select)

    const sharedProjectOption = screen.getByRole('option', { name: 'Shared Project' })
    fireEvent.click(sharedProjectOption)

    expect(onProjectSelect).toHaveBeenCalledWith('shared-project')
  })

  it('should show loading indicator when loading', () => {
    mockUseProjectContext.mockReturnValue({
      ...mockProjectContext,
      isLoading: true
    })

    renderProjectSelector()

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('should not render when no projects available', () => {
    mockUseProjectContext.mockReturnValue({
      ...mockProjectContext,
      projects: []
    })

    const { container } = renderProjectSelector()

    expect(container.firstChild).toBeNull()
  })
})
