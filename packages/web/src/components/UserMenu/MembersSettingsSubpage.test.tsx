import { render, screen } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import MembersSettingsSubpage from './MembersSettingsSubpage'
import { ProjectRole } from '../../types/project'
import { IProjectMemberDetails } from '../../types/projectMemberDetails'

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

const mockUseProjectMembersContext = vi.fn(() => ({
  members: mockMembers,
  isLoading: false,
  isError: false,
}))

vi.mock('../../providers/ProjectMembersProvider', () => ({
  ProjectMembersProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useProjectMembersContext: () => mockUseProjectMembersContext(),
}))

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
    })
  })

  it('should render the subpage title', () => {
    render(<MembersSettingsSubpage {...defaultProps} />)

    expect(screen.getByText('Project Members')).toBeVisible()
  })

  it('should call onBack when back button is clicked', () => {
    render(<MembersSettingsSubpage {...defaultProps} />)

    fireEvent.click(screen.getByRole('button'))

    expect(defaultProps.onBack).toHaveBeenCalledTimes(1)
  })

  it('should render member names', () => {
    render(<MembersSettingsSubpage {...defaultProps} />)

    expect(screen.getByText('Alice Smith')).toBeVisible()
    expect(screen.getByText('Bob Jones')).toBeVisible()
  })

  it('should render role badges', () => {
    render(<MembersSettingsSubpage {...defaultProps} />)

    expect(screen.getByText('Owner')).toBeVisible()
    expect(screen.getByText('Member')).toBeVisible()
  })

  it('should render member avatars with initials as fallback', () => {
    render(<MembersSettingsSubpage {...defaultProps} />)

    expect(screen.getByText('B')).toBeVisible()
  })

  it('should show loading spinner when members are loading', () => {
    mockUseProjectMembersContext.mockReturnValue({
      members: [],
      isLoading: true,
      isError: false,
    })

    render(<MembersSettingsSubpage {...defaultProps} />)

    expect(screen.getByRole('progressbar')).toBeVisible()
  })

  it('should show error message when loading fails', () => {
    mockUseProjectMembersContext.mockReturnValue({
      members: [],
      isLoading: false,
      isError: true,
    })

    render(<MembersSettingsSubpage {...defaultProps} />)

    expect(screen.getByText('Failed to load members')).toBeVisible()
  })

  it('should show empty message when no members exist', () => {
    mockUseProjectMembersContext.mockReturnValue({
      members: [],
      isLoading: false,
      isError: false,
    })

    render(<MembersSettingsSubpage {...defaultProps} />)

    expect(screen.getByText('No members found')).toBeVisible()
  })
})
