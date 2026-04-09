import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import MembersSettingsSubpage from './MembersSettingsSubpage'
import { ProjectRole } from '../../types/project'
import { IProjectMemberDetails } from '../../types/projectMemberDetails'

const theme = createTheme()

const mockMembers: IProjectMemberDetails[] = [
  {
    userId: 'user-1',
    name: 'Alice Smith',
    role: ProjectRole.OWNER,
    avatar: 'https://example.com/alice.jpg',
  },
  {
    userId: 'user-2',
    name: 'Bob Jones',
    role: ProjectRole.MEMBER,
    givenName: 'Bob',
  },
]

const mockRemoveMember = vi.fn()

const mockUseProjectMembersContext = vi.fn(() => ({
  members: mockMembers,
  isLoading: false,
  isError: false,
  removeMember: mockRemoveMember,
}))

const mockUseProjectContext = vi.fn(() => ({
  currentProject: { id: 'project-1', ownerId: 'user-1', name: 'Test Project', isPersonal: false },
}))

const mockUseAuth = vi.fn(() => ({
  user: { profile: { sub: 'user-1' }, access_token: 'token' },
}))

vi.mock('../../providers/ProjectMembersProvider', () => ({
  ProjectMembersProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useProjectMembersContext: () => mockUseProjectMembersContext(),
}))

vi.mock('../../providers/ProjectProvider', () => ({
  useProjectContext: () => mockUseProjectContext(),
}))

vi.mock('react-oidc-context', () => ({
  useAuth: () => mockUseAuth(),
}))

const renderComponent = (props = {}) => {
  return render(
    <ThemeProvider theme={theme}>
      <MembersSettingsSubpage onBack={vi.fn()} {...props} />
    </ThemeProvider>
  )
}

describe('Given the MembersSettingsSubpage component', () => {
  const defaultProps = {
    onBack: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseProjectMembersContext.mockReturnValue({
      members: mockMembers,
      isLoading: false,
      isError: false,
      removeMember: mockRemoveMember,
    })
    mockUseProjectContext.mockReturnValue({
      currentProject: {
        id: 'project-1',
        ownerId: 'user-1',
        name: 'Test Project',
        isPersonal: false,
      },
    })
    mockUseAuth.mockReturnValue({
      user: { profile: { sub: 'user-1' }, access_token: 'token' },
    })
  })

  it('should render the subpage title', () => {
    renderComponent(defaultProps)

    expect(screen.getByText('Project Members')).toBeVisible()
  })

  it('should call onBack when back button is clicked', () => {
    renderComponent(defaultProps)

    const backButton = screen.getByText('Project Members').previousElementSibling!
    fireEvent.click(backButton)

    expect(defaultProps.onBack).toHaveBeenCalledTimes(1)
  })

  it('should render member names', () => {
    renderComponent(defaultProps)

    expect(screen.getByText('Alice Smith')).toBeVisible()
    expect(screen.getByText('Bob Jones')).toBeVisible()
  })

  it('should render role badges', () => {
    renderComponent(defaultProps)

    expect(screen.getByText('Owner')).toBeVisible()
    expect(screen.getByText('Member')).toBeVisible()
  })

  it('should render member avatars with initials as fallback', () => {
    renderComponent(defaultProps)

    expect(screen.getByText('B')).toBeVisible()
  })

  it('should show loading spinner when members are loading', () => {
    mockUseProjectMembersContext.mockReturnValue({
      members: [],
      isLoading: true,
      isError: false,
      removeMember: mockRemoveMember,
    })

    renderComponent(defaultProps)

    expect(screen.getByRole('progressbar')).toBeVisible()
  })

  it('should show error message when loading fails', () => {
    mockUseProjectMembersContext.mockReturnValue({
      members: [],
      isLoading: false,
      isError: true,
      removeMember: mockRemoveMember,
    })

    renderComponent(defaultProps)

    expect(screen.getByText('Failed to load members')).toBeVisible()
  })

  it('should show empty message when no members exist', () => {
    mockUseProjectMembersContext.mockReturnValue({
      members: [],
      isLoading: false,
      isError: false,
      removeMember: mockRemoveMember,
    })

    renderComponent(defaultProps)

    expect(screen.getByText('No members found')).toBeVisible()
  })

  describe('When the current user is the owner', () => {
    it('should show remove button for non-owner members', () => {
      renderComponent(defaultProps)

      expect(screen.getByLabelText('Remove Bob Jones')).toBeVisible()
    })

    it('should not show remove button for the owner', () => {
      renderComponent(defaultProps)

      expect(screen.queryByLabelText('Remove Alice Smith')).not.toBeInTheDocument()
    })

    it('should open confirmation dialog when remove button is clicked', () => {
      renderComponent(defaultProps)

      fireEvent.click(screen.getByLabelText('Remove Bob Jones'))

      expect(screen.getByText('Remove Member')).toBeVisible()
      expect(
        screen.getByText(/Are you sure you want to remove/)
      ).toBeVisible()
    })

    it('should call removeMember when confirmed', async () => {
      mockRemoveMember.mockResolvedValue(undefined)
      renderComponent(defaultProps)

      fireEvent.click(screen.getByLabelText('Remove Bob Jones'))
      fireEvent.click(screen.getByRole('button', { name: 'Remove' }))

      await waitFor(() => {
        expect(mockRemoveMember).toHaveBeenCalledWith('user-2')
      })
    })

    it('should close dialog when cancel is clicked', async () => {
      renderComponent(defaultProps)

      fireEvent.click(screen.getByLabelText('Remove Bob Jones'))
      expect(screen.getByText('Remove Member')).toBeVisible()

      fireEvent.click(screen.getByText('Cancel'))

      await waitFor(() => {
        expect(screen.queryByText('Remove Member')).not.toBeInTheDocument()
      })
    })
  })

  describe('When the current user is not the owner', () => {
    it('should not show remove buttons', () => {
      mockUseAuth.mockReturnValue({
        user: { profile: { sub: 'user-2' }, access_token: 'token' },
      })

      renderComponent(defaultProps)

      expect(screen.queryByLabelText('Remove Bob Jones')).not.toBeInTheDocument()
      expect(screen.queryByLabelText('Remove Alice Smith')).not.toBeInTheDocument()
    })
  })
})
