import { render, screen } from '@testing-library/react'
import OfficeAttendanceGroup from '.'
import { IOfficeAttendance } from '../../../../types/officeAttendance'

const createEntry = (
  overrides: Partial<IOfficeAttendance> = {}
): IOfficeAttendance => ({
  id: 'att-1',
  projectId: 'project-1',
  date: '2026-04-08',
  userId: 'user-1',
  userName: 'Alice',
  createdBy: 'user-1',
  createdAt: '2026-01-01T00:00:00Z',
  ...overrides,
})

describe('Given the OfficeAttendanceGroup component', () => {
  it('should render nothing when entries are empty', () => {
    const { container } = render(<OfficeAttendanceGroup entries={[]} />)

    expect(container.firstChild).toBeNull()
  })

  it('should render user avatars for each entry', () => {
    const entries = [
      createEntry({ id: 'att-1', userName: 'Alice' }),
      createEntry({ id: 'att-2', userName: 'Bob', userId: 'user-2' }),
    ]

    render(<OfficeAttendanceGroup entries={entries} />)

    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
  })

  it('should show overflow chip when more than 4 entries', () => {
    const entries = Array.from({ length: 6 }, (_, i) =>
      createEntry({
        id: `att-${i}`,
        userName: `User ${i}`,
        userId: `user-${i}`,
      })
    )

    render(<OfficeAttendanceGroup entries={entries} />)

    expect(screen.getByText('+2')).toBeInTheDocument()
  })

  it('should not show overflow chip when 4 or fewer entries', () => {
    const entries = Array.from({ length: 4 }, (_, i) =>
      createEntry({
        id: `att-${i}`,
        userName: `User ${i}`,
        userId: `user-${i}`,
      })
    )

    render(<OfficeAttendanceGroup entries={entries} />)

    expect(screen.queryByText(/^\+/)).not.toBeInTheDocument()
  })

  it('should render the office icon', () => {
    render(<OfficeAttendanceGroup entries={[createEntry()]} />)

    expect(screen.getByTestId('BusinessOutlinedIcon')).toBeInTheDocument()
  })
})
