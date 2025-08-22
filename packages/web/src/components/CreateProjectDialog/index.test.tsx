import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'
import CreateProjectDialog from './index'
import { IProject } from '../../types/project'

const theme = createTheme()

const mockProjects: IProject[] = [
  {
    id: 'personal-project',
    ownerId: 'test-user-id',
    name: 'Personal Project',
    isPersonal: true,
    maxMembers: 1,
    inviteCode: 'invite-123',
    createdAt: '2023-01-01T00:00:00Z'
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

const defaultProps = {
  open: true,
  onClose: jest.fn(),
  onSuccess: jest.fn()
}

const renderDialog = (props = {}) => {
  return render(
    <ThemeProvider theme={theme}>
      <CreateProjectDialog {...defaultProps} {...props} />
    </ThemeProvider>
  )
}

describe('CreateProjectDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseProjectContext.mockReturnValue(mockProjectContext)
  })

  it('should render dialog when open', () => {
    renderDialog()

    expect(screen.getByText('Create New Project')).toBeInTheDocument()
    expect(screen.getByLabelText('Project Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Maximum Members')).toBeInTheDocument()
  })

  it('should not render dialog when closed', () => {
    renderDialog({ open: false })

    expect(screen.queryByText('Create New Project')).not.toBeInTheDocument()
  })

  it('should call onClose when cancel button is clicked', () => {
    const onClose = jest.fn()
    renderDialog({ onClose })

    fireEvent.click(screen.getByText('Cancel'))

    expect(onClose).toHaveBeenCalled()
  })

  it('should disable create button when project name is empty', () => {
    renderDialog()

    expect(screen.getByText('Create Project')).toBeDisabled()
  })

  it('should validate project name length', async () => {
    renderDialog()

    const nameInput = screen.getByLabelText('Project Name')
    fireEvent.change(nameInput, { target: { value: 'a' } })
    fireEvent.click(screen.getByText('Create Project'))

    await waitFor(() => {
      expect(screen.getByText('Project name must be at least 2 characters')).toBeInTheDocument()
    })
  })

  it('should validate duplicate project names', async () => {
    renderDialog()

    const nameInput = screen.getByLabelText('Project Name')
    fireEvent.change(nameInput, { target: { value: 'Personal Project' } })
    fireEvent.click(screen.getByText('Create Project'))

    await waitFor(() => {
      expect(screen.getByText('A project with this name already exists')).toBeInTheDocument()
    })
  })

  it('should call createProject with correct data', async () => {
    const createProject = jest.fn().mockResolvedValue({ id: 'new-project' })
    mockUseProjectContext.mockReturnValue({
      ...mockProjectContext,
      createProject
    })

    renderDialog()

    const nameInput = screen.getByLabelText('Project Name')
    const membersInput = screen.getByLabelText('Maximum Members')
    
    fireEvent.change(nameInput, { target: { value: 'New Project' } })
    fireEvent.change(membersInput, { target: { value: '3' } })
    fireEvent.click(screen.getByText('Create Project'))

    await waitFor(() => {
      expect(createProject).toHaveBeenCalledWith({
        name: 'New Project',
        maxMembers: 3
      })
    })
  })

  it('should show warning when at project limit', () => {
    const projectsAtLimit = Array.from({ length: 5 }, (_, i) => ({
      id: `project-${i}`,
      ownerId: 'test-user-id',
      name: `Project ${i}`,
      isPersonal: i === 0,
      maxMembers: 5,
      inviteCode: `invite-${i}`,
      createdAt: '2023-01-01T00:00:00Z'
    }))

    mockUseProjectContext.mockReturnValue({
      ...mockProjectContext,
      projects: projectsAtLimit
    })

    renderDialog()

    expect(screen.getByText(/You have reached the maximum of 5 projects/)).toBeInTheDocument()
    expect(screen.getByText('Create Project')).toBeDisabled()
  })

  it('should handle creation errors', async () => {
    const createProject = jest.fn().mockRejectedValue(new Error('Creation failed'))
    mockUseProjectContext.mockReturnValue({
      ...mockProjectContext,
      createProject
    })

    renderDialog()

    const nameInput = screen.getByLabelText('Project Name')
    fireEvent.change(nameInput, { target: { value: 'New Project' } })
    fireEvent.click(screen.getByText('Create Project'))

    await waitFor(() => {
      expect(screen.getByText('Creation failed')).toBeInTheDocument()
    })
  })
})
