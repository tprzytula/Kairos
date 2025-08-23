import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import { ProjectProvider, useProjectContext } from './ProjectProvider'
import { retrieveUserProjects, createProject, joinProject, getProjectInviteInfo } from '../../api/projects'

const mockUseAuth = jest.fn()

jest.mock('react-oidc-context', () => ({
  useAuth: () => mockUseAuth(),
}))

jest.mock('../../api/projects', () => ({
  retrieveUserProjects: jest.fn(),
  createProject: jest.fn(),
  joinProject: jest.fn(),
  getProjectInviteInfo: jest.fn(),
}))

const mockRetrieveUserProjects = retrieveUserProjects as jest.MockedFunction<typeof retrieveUserProjects>
const mockCreateProject = createProject as jest.MockedFunction<typeof createProject>
const mockJoinProject = joinProject as jest.MockedFunction<typeof joinProject>
const mockGetProjectInviteInfo = getProjectInviteInfo as jest.MockedFunction<typeof getProjectInviteInfo>

const TestComponent = () => {
  const context = useProjectContext()
  return (
    <div>
      <div data-testid="projects-count">{context.projects.length}</div>
      <div data-testid="current-project">{context.currentProject?.name || 'None'}</div>
      <div data-testid="loading">{context.isLoading ? 'Loading' : 'Loaded'}</div>
    </div>
  )
}

const renderWithProvider = () => {
  return render(
    <ProjectProvider>
      <TestComponent />
    </ProjectProvider>
  )
}

describe('ProjectProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { 
        sub: 'test-user-id',
        access_token: 'test-access-token'
      }
    })
  })

  it('should fetch projects on mount when authenticated', async () => {
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

    mockRetrieveUserProjects.mockResolvedValue(mockProjects)

    renderWithProvider()

    await waitFor(() => {
      expect(screen.getByTestId('projects-count')).toHaveTextContent('2')
      expect(screen.getByTestId('current-project')).toHaveTextContent('Personal Project')
      expect(screen.getByTestId('loading')).toHaveTextContent('Loaded')
    })

    expect(mockRetrieveUserProjects).toHaveBeenCalledTimes(1)
  })

  it('should select personal project as default', async () => {
    const mockProjects = [
      {
        id: 'shared-project',
        ownerId: 'other-user-id',
        name: 'Shared Project',
        isPersonal: false,
        maxMembers: 5,
        inviteCode: 'invite-456',
        createdAt: '2023-01-02T00:00:00Z'
      },
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

    mockRetrieveUserProjects.mockResolvedValue(mockProjects)

    renderWithProvider()

    await waitFor(() => {
      expect(screen.getByTestId('current-project')).toHaveTextContent('Personal Project')
    })
  })

  it('should handle API errors gracefully', async () => {
    mockRetrieveUserProjects.mockRejectedValue(new Error('API Error'))

    renderWithProvider()

    await waitFor(() => {
      expect(screen.getByTestId('projects-count')).toHaveTextContent('0')
      expect(screen.getByTestId('current-project')).toHaveTextContent('None')
      expect(screen.getByTestId('loading')).toHaveTextContent('Loaded')
    })
  })

  it('should restore last selected project from localStorage', async () => {
    localStorage.setItem('selected-project-id', 'shared-project')

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

    mockRetrieveUserProjects.mockResolvedValue(mockProjects)

    renderWithProvider()

    await waitFor(() => {
      expect(screen.getByTestId('current-project')).toHaveTextContent('Shared Project')
    })
  })

  it('should not fetch projects when unauthenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null
    })

    renderWithProvider()

    expect(mockRetrieveUserProjects).not.toHaveBeenCalled()
    expect(screen.getByTestId('projects-count')).toHaveTextContent('0')
    expect(screen.getByTestId('current-project')).toHaveTextContent('None')
  })

  it('should not fetch projects when no access token', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { sub: 'test-user-id' }
    })

    renderWithProvider()

    expect(mockRetrieveUserProjects).not.toHaveBeenCalled()
    expect(screen.getByTestId('projects-count')).toHaveTextContent('0')
    expect(screen.getByTestId('current-project')).toHaveTextContent('None')
  })
})
