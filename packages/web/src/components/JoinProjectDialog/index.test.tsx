import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import JoinProjectDialog from './index'
import { useProjectContext } from '../../providers/ProjectProvider'
import { IProjectInviteInfo } from '../../types/project'

jest.mock('../../providers/ProjectProvider')

const mockUseProjectContext = useProjectContext as jest.MockedFunction<typeof useProjectContext>

const theme = createTheme()

const mockProjectInviteInfo: IProjectInviteInfo = {
  id: 'test-project-id',
  name: 'Test Project',
  memberCount: 3,
  maxMembers: 10,
  ownerName: 'John Doe'
}

const renderDialog = (props = {}) => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    onSuccess: jest.fn()
  }

  return render(
    <ThemeProvider theme={theme}>
      <JoinProjectDialog {...defaultProps} {...props} />
    </ThemeProvider>
  )
}

describe('JoinProjectDialog component', () => {
  beforeEach(() => {
    mockUseProjectContext.mockReturnValue({
      joinProject: jest.fn(),
      getProjectInviteInfo: jest.fn(),
      projects: [],
      currentProject: null,
      isLoading: false,
      createProject: jest.fn(),
      switchProject: jest.fn(),
      fetchProjects: jest.fn()
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Dialog Display', () => {
    it('should display join project dialog when open', () => {
      renderDialog()
      
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('Enter the 6-character invite code to join an existing project.')).toBeInTheDocument()
      expect(screen.getByText('Enter invite code')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Join Project' })).toBeInTheDocument()
    })

    it('should display 6 input boxes for invite code', () => {
      renderDialog()
      
      const inputs = screen.getAllByRole('textbox')
      expect(inputs).toHaveLength(6)
      
      inputs.forEach(input => {
        expect(input).toHaveAttribute('maxlength', '1')
      })
    })

    it('should focus first input when dialog opens', async () => {
      renderDialog()
      
      await waitFor(() => {
        const inputs = screen.getAllByRole('textbox')
        expect(inputs[0]).toBeInTheDocument()
      }, { timeout: 3000 })
    })
  })

  describe('Invite Code Input', () => {
    it('should move focus to next input when character is entered', async () => {
      const user = userEvent.setup()
      renderDialog()
      
      const inputs = screen.getAllByRole('textbox')
      
      await user.type(inputs[0], 'A')
      
      expect(inputs[0]).toHaveValue('A')
      expect(inputs[1]).toHaveFocus()
    })

    it('should convert lowercase to uppercase', async () => {
      const user = userEvent.setup()
      renderDialog()
      
      const inputs = screen.getAllByRole('textbox')
      
      await user.type(inputs[0], 'a')
      
      expect(inputs[0]).toHaveValue('A')
    })

    it('should handle input characters correctly', async () => {
      const user = userEvent.setup()
      renderDialog()
      
      const inputs = screen.getAllByRole('textbox')
      
      await user.type(inputs[1], 'B')
      expect(inputs[1]).toHaveValue('B')
      
      await user.type(inputs[2], '3')
      expect(inputs[2]).toHaveValue('3')
    })

    it('should handle arrow key navigation', async () => {
      const user = userEvent.setup()
      renderDialog()
      
      const inputs = screen.getAllByRole('textbox')
      
      expect(inputs).toHaveLength(6)
      
      inputs[2].focus()
      expect(inputs[2]).toHaveFocus()
    })

    it('should handle paste of 6-character code', async () => {
      const user = userEvent.setup()
      const mockGetProjectInviteInfo = jest.fn().mockResolvedValue(mockProjectInviteInfo)
      mockUseProjectContext.mockReturnValue({
        joinProject: jest.fn(),
        getProjectInviteInfo: mockGetProjectInviteInfo,
        projects: [],
        currentProject: null,
        isLoading: false,
        createProject: jest.fn(),
        switchProject: jest.fn(),
        fetchProjects: jest.fn()
      })
      
      renderDialog()
      
      const inputs = screen.getAllByRole('textbox')
      
      await user.click(inputs[0])
      await user.paste('ABC123')
      
      expect(inputs[0]).toHaveValue('A')
      expect(inputs[1]).toHaveValue('B')
      expect(inputs[2]).toHaveValue('C')
      expect(inputs[3]).toHaveValue('1')
      expect(inputs[4]).toHaveValue('2')
      expect(inputs[5]).toHaveValue('3')
      
      await waitFor(() => {
        expect(mockGetProjectInviteInfo).toHaveBeenCalledWith('ABC123')
      })
    })
  })

  describe('Project Preview', () => {
    it('should fetch and display project info when 6 characters entered', async () => {
      const user = userEvent.setup()
      const mockGetProjectInviteInfo = jest.fn().mockResolvedValue(mockProjectInviteInfo)
      mockUseProjectContext.mockReturnValue({
        joinProject: jest.fn(),
        getProjectInviteInfo: mockGetProjectInviteInfo,
        projects: [],
        currentProject: null,
        isLoading: false,
        createProject: jest.fn(),
        switchProject: jest.fn(),
        fetchProjects: jest.fn()
      })
      
      renderDialog()
      
      const inputs = screen.getAllByRole('textbox')
      
      for (let i = 0; i < 6; i++) {
        await user.type(inputs[i], `${i + 1}`)
      }
      
      await waitFor(() => {
        expect(mockGetProjectInviteInfo).toHaveBeenCalledWith('123456')
      })
      
      await waitFor(() => {
        expect(screen.getByText('Test Project')).toBeInTheDocument()
        expect(screen.getByText('3/10 members')).toBeInTheDocument()
        expect(screen.getByText('Owner: John Doe')).toBeInTheDocument()
      })
    })

    it('should show loading state while fetching project info', async () => {
      const user = userEvent.setup()
      const mockGetProjectInviteInfo = jest.fn().mockImplementation(() => new Promise(() => {}))
      mockUseProjectContext.mockReturnValue({
        joinProject: jest.fn(),
        getProjectInviteInfo: mockGetProjectInviteInfo,
        projects: [],
        currentProject: null,
        isLoading: false,
        createProject: jest.fn(),
        switchProject: jest.fn(),
        fetchProjects: jest.fn()
      })
      
      renderDialog()
      
      const inputs = screen.getAllByRole('textbox')
      
      for (let i = 0; i < 6; i++) {
        await user.type(inputs[i], `${i + 1}`)
      }
      
      await waitFor(() => {
        expect(screen.getByText('Loading project information...')).toBeInTheDocument()
      })
    })

    it('should show error when invalid invite code entered', async () => {
      const user = userEvent.setup()
      const mockGetProjectInviteInfo = jest.fn().mockRejectedValue(new Error('Invalid code'))
      mockUseProjectContext.mockReturnValue({
        joinProject: jest.fn(),
        getProjectInviteInfo: mockGetProjectInviteInfo,
        projects: [],
        currentProject: null,
        isLoading: false,
        createProject: jest.fn(),
        switchProject: jest.fn(),
        fetchProjects: jest.fn()
      })
      
      renderDialog()
      
      const inputs = screen.getAllByRole('textbox')
      
      for (let i = 0; i < 6; i++) {
        await user.type(inputs[i], `${i + 1}`)
      }
      
      await waitFor(() => {
        expect(screen.getByText('Invalid invite code. Please check and try again.')).toBeInTheDocument()
      })
    })
  })

  describe('Join Project Action', () => {
    it('should enable join button when valid project info loaded', async () => {
      const user = userEvent.setup()
      const mockGetProjectInviteInfo = jest.fn().mockResolvedValue(mockProjectInviteInfo)
      mockUseProjectContext.mockReturnValue({
        joinProject: jest.fn(),
        getProjectInviteInfo: mockGetProjectInviteInfo,
        projects: [],
        currentProject: null,
        isLoading: false,
        createProject: jest.fn(),
        switchProject: jest.fn(),
        fetchProjects: jest.fn()
      })
      
      renderDialog()
      
      const inputs = screen.getAllByRole('textbox')
      const joinButton = screen.getByRole('button', { name: 'Join Project' })
      
      expect(joinButton).toBeDisabled()
      
      for (let i = 0; i < 6; i++) {
        await user.type(inputs[i], `${i + 1}`)
      }
      
      await waitFor(() => {
        expect(joinButton).toBeEnabled()
      })
    })

    it('should successfully join project when button clicked', async () => {
      const user = userEvent.setup()
      const mockJoinProject = jest.fn().mockResolvedValue(undefined)
      const mockGetProjectInviteInfo = jest.fn().mockResolvedValue(mockProjectInviteInfo)
      const mockOnSuccess = jest.fn()
      const mockOnClose = jest.fn()
      
      mockUseProjectContext.mockReturnValue({
        joinProject: mockJoinProject,
        getProjectInviteInfo: mockGetProjectInviteInfo,
        projects: [],
        currentProject: null,
        isLoading: false,
        createProject: jest.fn(),
        switchProject: jest.fn(),
        fetchProjects: jest.fn()
      })
      
      renderDialog({ onSuccess: mockOnSuccess, onClose: mockOnClose })
      
      const inputs = screen.getAllByRole('textbox')
      const joinButton = screen.getByRole('button', { name: 'Join Project' })
      
      for (let i = 0; i < 6; i++) {
        await user.type(inputs[i], `${i + 1}`)
      }
      
      await waitFor(() => {
        expect(joinButton).toBeEnabled()
      })
      
      await user.click(joinButton)
      
      await waitFor(() => {
        expect(mockJoinProject).toHaveBeenCalledWith({ inviteCode: '123456' })
        expect(mockOnSuccess).toHaveBeenCalled()
        expect(mockOnClose).toHaveBeenCalled()
      })
    })

    it('should handle join project error', async () => {
      const user = userEvent.setup()
      const mockJoinProject = jest.fn().mockRejectedValue(new Error('Join failed'))
      const mockGetProjectInviteInfo = jest.fn().mockResolvedValue(mockProjectInviteInfo)
      
      mockUseProjectContext.mockReturnValue({
        joinProject: mockJoinProject,
        getProjectInviteInfo: mockGetProjectInviteInfo,
        projects: [],
        currentProject: null,
        isLoading: false,
        createProject: jest.fn(),
        switchProject: jest.fn(),
        fetchProjects: jest.fn()
      })
      
      renderDialog()
      
      const inputs = screen.getAllByRole('textbox')
      const joinButton = screen.getByRole('button', { name: 'Join Project' })
      
      for (let i = 0; i < 6; i++) {
        await user.type(inputs[i], `${i + 1}`)
      }
      
      await waitFor(() => {
        expect(joinButton).toBeEnabled()
      })
      
      await user.click(joinButton)
      
      await waitFor(() => {
        expect(screen.getByText('Join failed')).toBeInTheDocument()
      })
    })

    it('should handle Enter key to join project', async () => {
      const user = userEvent.setup()
      const mockJoinProject = jest.fn().mockResolvedValue(undefined)
      const mockGetProjectInviteInfo = jest.fn().mockResolvedValue(mockProjectInviteInfo)
      
      mockUseProjectContext.mockReturnValue({
        joinProject: mockJoinProject,
        getProjectInviteInfo: mockGetProjectInviteInfo,
        projects: [],
        currentProject: null,
        isLoading: false,
        createProject: jest.fn(),
        switchProject: jest.fn(),
        fetchProjects: jest.fn()
      })
      
      renderDialog()
      
      const inputs = screen.getAllByRole('textbox')
      
      for (let i = 0; i < 6; i++) {
        await user.type(inputs[i], `${i + 1}`)
      }
      
      await waitFor(() => {
        expect(screen.getByText('Test Project')).toBeInTheDocument()
      })
      
      await user.keyboard('[Enter]')
      
      await waitFor(() => {
        expect(mockJoinProject).toHaveBeenCalledWith({ inviteCode: '123456' })
      })
    })
  })

  describe('Validation and Edge Cases', () => {
    it('should show warning when user is at project limit', () => {
      const mockProjects = Array.from({ length: 5 }, (_, i) => ({
        id: `project-${i}`,
        name: `Project ${i}`,
        ownerId: 'user-id',
        isPersonal: i === 0,
        maxMembers: 10,
        inviteCode: `CODE${i}`,
        createdAt: new Date().toISOString()
      }))
      
      mockUseProjectContext.mockReturnValue({
        joinProject: jest.fn(),
        getProjectInviteInfo: jest.fn(),
        projects: mockProjects,
        currentProject: null,
        isLoading: false,
        createProject: jest.fn(),
        switchProject: jest.fn(),
        fetchProjects: jest.fn()
      })
      
      renderDialog()
      
      expect(screen.getByText('You have reached the maximum of 5 projects. Leave an existing project to join a new one.')).toBeInTheDocument()
    })

    it('should prevent joining when already a member', async () => {
      const user = userEvent.setup()
      const mockGetProjectInviteInfo = jest.fn().mockResolvedValue(mockProjectInviteInfo)
      const existingProjects = [{
        id: 'test-project-id',
        name: 'Test Project',
        ownerId: 'owner-id',
        isPersonal: false,
        maxMembers: 10,
        inviteCode: 'CODE123',
        createdAt: new Date().toISOString()
      }]
      
      mockUseProjectContext.mockReturnValue({
        joinProject: jest.fn(),
        getProjectInviteInfo: mockGetProjectInviteInfo,
        projects: existingProjects,
        currentProject: null,
        isLoading: false,
        createProject: jest.fn(),
        switchProject: jest.fn(),
        fetchProjects: jest.fn()
      })
      
      renderDialog()
      
      const inputs = screen.getAllByRole('textbox')
      const joinButton = screen.getByRole('button', { name: 'Join Project' })
      
      for (let i = 0; i < 6; i++) {
        await user.type(inputs[i], `${i + 1}`)
      }
      
      await waitFor(() => {
        expect(screen.getByText('Test Project')).toBeInTheDocument()
      })
      
      await user.click(joinButton)
      
      await waitFor(() => {
        expect(screen.getByText('You are already a member of this project')).toBeInTheDocument()
      })
    })

    it('should prevent joining when project is full', async () => {
      const user = userEvent.setup()
      const fullProjectInfo = { ...mockProjectInviteInfo, memberCount: 10, maxMembers: 10 }
      const mockGetProjectInviteInfo = jest.fn().mockResolvedValue(fullProjectInfo)
      
      mockUseProjectContext.mockReturnValue({
        joinProject: jest.fn(),
        getProjectInviteInfo: mockGetProjectInviteInfo,
        projects: [],
        currentProject: null,
        isLoading: false,
        createProject: jest.fn(),
        switchProject: jest.fn(),
        fetchProjects: jest.fn()
      })
      
      renderDialog()
      
      const inputs = screen.getAllByRole('textbox')
      const joinButton = screen.getByRole('button', { name: 'Join Project' })
      
      for (let i = 0; i < 6; i++) {
        await user.type(inputs[i], `${i + 1}`)
      }
      
      await waitFor(() => {
        expect(screen.getByText('10/10 members')).toBeInTheDocument()
      })
      
      await user.click(joinButton)
      
      await waitFor(() => {
        expect(screen.getByText('This project is full and cannot accept new members')).toBeInTheDocument()
      })
    })
  })

  describe('Dialog Close and Reset', () => {
    it('should reset state when dialog closes', async () => {
      const user = userEvent.setup()
      const mockOnClose = jest.fn()
      
      renderDialog({ onClose: mockOnClose })
      
      const inputs = screen.getAllByRole('textbox')
      
      await user.type(inputs[0], 'A')
      await user.type(inputs[1], 'B')
      
      const cancelButton = screen.getByRole('button', { name: 'Cancel' })
      await user.click(cancelButton)
      
      expect(mockOnClose).toHaveBeenCalled()
    })

    it('should disable inputs during join process', async () => {
      const user = userEvent.setup()
      const mockJoinProject = jest.fn().mockImplementation(() => new Promise(() => {}))
      const mockGetProjectInviteInfo = jest.fn().mockResolvedValue(mockProjectInviteInfo)
      
      mockUseProjectContext.mockReturnValue({
        joinProject: mockJoinProject,
        getProjectInviteInfo: mockGetProjectInviteInfo,
        projects: [],
        currentProject: null,
        isLoading: false,
        createProject: jest.fn(),
        switchProject: jest.fn(),
        fetchProjects: jest.fn()
      })
      
      renderDialog()
      
      const inputs = screen.getAllByRole('textbox')
      
      for (let i = 0; i < 6; i++) {
        await user.type(inputs[i], `${i + 1}`)
      }
      
      await waitFor(() => {
        expect(screen.getByText('Test Project')).toBeInTheDocument()
      })
      
      const joinButton = screen.getByRole('button', { name: 'Join Project' })
      await user.click(joinButton)
      
      await waitFor(() => {
        inputs.forEach(input => {
          expect(input).toBeDisabled()
        })
      })
    })
  })
})
