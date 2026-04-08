import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GroupedView from '.'
import {
  IGroupedTodoItem,
  IGroupedAdventureItem,
  IGroupedBirthdayItem,
  IGroupedOfficeAttendanceItem,
  TimeGroup,
} from '../utils/timeGrouping'

const mockGroupedToDoItems: IGroupedTodoItem[] = [
  {
    group: TimeGroup.OVERDUE,
    groupLabel: 'Overdue (2)',
    priority: 1,
    items: [
      {
        id: '1',
        name: 'Overdue task 1',
        description: 'This task is overdue',
        isDone: false,
        dueDate: Date.now() - 86400000,
      },
      {
        id: '2',
        name: 'Overdue task 2',
        description: 'This task is also overdue',
        isDone: false,
        dueDate: Date.now() - 172800000,
      },
    ],
  },
  {
    group: TimeGroup.TODAY,
    groupLabel: 'Due Today',
    priority: 2,
    items: [
      {
        id: '3',
        name: 'Today task',
        description: 'This task is due today',
        isDone: false,
        dueDate: Date.now(),
      },
    ],
  },
]

const mockGroupedAdventures: IGroupedAdventureItem[] = [
  {
    group: TimeGroup.TODAY,
    groupLabel: 'Today',
    priority: 2,
    items: [
      {
        id: 'adv-1',
        projectId: 'project-1',
        name: 'Visit Museum',
        date: '2026-04-05',
        location: 'London',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
    ],
  },
]

const mockGroupedBirthdays: IGroupedBirthdayItem[] = [
  {
    group: TimeGroup.TODAY,
    groupLabel: 'Today',
    priority: 2,
    items: [
      {
        id: 'bday-1',
        name: 'Alice Birthday',
        month: 4,
        day: 8,
        nextDate: '2026-04-08',
      },
    ],
  },
]

const mockGroupedAttendance: IGroupedOfficeAttendanceItem[] = [
  {
    group: TimeGroup.TODAY,
    groupLabel: 'Today',
    priority: 2,
    items: [
      {
        id: 'att-1',
        projectId: 'project-1',
        date: '2026-04-08',
        userId: 'user-1',
        userName: 'Bob',
        createdBy: 'user-1',
        createdAt: '2026-01-01T00:00:00Z',
      },
    ],
  },
]

describe('Given the GroupedView component', () => {
  const mockOnSwipeAction = vi.fn()
  const mockOnEditAction = vi.fn()
  const mockOnAdventureClick = vi.fn()
  const mockOnBirthdayClick = vi.fn()

  const defaultProps = {
    groupedToDoItems: mockGroupedToDoItems,
    groupedAdventures: [] as IGroupedAdventureItem[],
    groupedBirthdays: [] as IGroupedBirthdayItem[],
    groupedOfficeAttendance: [] as IGroupedOfficeAttendanceItem[],
    onSwipeAction: mockOnSwipeAction,
    onEditAction: mockOnEditAction,
    onAdventureClick: mockOnAdventureClick,
    onBirthdayClick: mockOnBirthdayClick,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('When rendering with grouped to-do items', () => {
    it('should display the time group sections with items', () => {
      render(<GroupedView {...defaultProps} />)

      expect(screen.getByText('Overdue (2)')).toBeInTheDocument()
      expect(screen.getByText('Today')).toBeInTheDocument()
      expect(screen.getByText('Overdue task 1')).toBeInTheDocument()
      expect(screen.getByText('Overdue task 2')).toBeInTheDocument()
      expect(screen.getByText('Today task')).toBeInTheDocument()
    })

    it('should display the appropriate time group icons', () => {
      render(<GroupedView {...defaultProps} />)

      expect(screen.getByText('⚠️')).toBeInTheDocument()
      expect(screen.getByText('📅')).toBeInTheDocument()
    })

    it('should render collapsible sections for each time group', () => {
      render(<GroupedView {...defaultProps} />)

      expect(screen.getAllByLabelText('Collapse')).toHaveLength(2)
    })
  })

  describe('When rendering with empty data', () => {
    it('should render without errors', () => {
      const { container } = render(
        <GroupedView {...defaultProps} groupedToDoItems={[]} />
      )

      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('When rendering with grouped adventures', () => {
    it('should display adventures in the same section as todos when they share a time group', () => {
      render(
        <GroupedView
          {...defaultProps}
          groupedAdventures={mockGroupedAdventures}
        />
      )

      expect(screen.getByText('Visit Museum')).toBeInTheDocument()
      expect(screen.getByText('Today task')).toBeInTheDocument()
    })

    it('should call onAdventureClick when an adventure is clicked', async () => {
      render(
        <GroupedView
          {...defaultProps}
          groupedAdventures={mockGroupedAdventures}
        />
      )

      await userEvent.click(screen.getByText('Visit Museum'))

      expect(mockOnAdventureClick).toHaveBeenCalledWith('adv-1')
    })
  })

  describe('When rendering with grouped birthdays', () => {
    it('should display birthdays in the same section as todos when they share a time group', () => {
      render(
        <GroupedView
          {...defaultProps}
          groupedBirthdays={mockGroupedBirthdays}
        />
      )

      expect(screen.getByText('Alice Birthday')).toBeInTheDocument()
      expect(screen.getByText('Today task')).toBeInTheDocument()
    })

    it('should call onBirthdayClick when a birthday is clicked', async () => {
      render(
        <GroupedView
          {...defaultProps}
          groupedBirthdays={mockGroupedBirthdays}
        />
      )

      await userEvent.click(screen.getByText('Alice Birthday'))

      expect(mockOnBirthdayClick).toHaveBeenCalledWith('bday-1')
    })
  })

  describe('When rendering with office attendance', () => {
    it('should display attendance avatars in the section', () => {
      render(
        <GroupedView
          {...defaultProps}
          groupedOfficeAttendance={mockGroupedAttendance}
        />
      )

      expect(screen.getByText('B')).toBeInTheDocument()
    })
  })

  describe('When all item types share the same time group', () => {
    it('should render a single unified section', () => {
      render(
        <GroupedView
          {...defaultProps}
          groupedToDoItems={[mockGroupedToDoItems[1]]}
          groupedAdventures={mockGroupedAdventures}
          groupedBirthdays={mockGroupedBirthdays}
          groupedOfficeAttendance={mockGroupedAttendance}
        />
      )

      const collapseSections = screen.getAllByLabelText('Collapse')
      expect(collapseSections).toHaveLength(1)

      expect(screen.getByText('Today task')).toBeInTheDocument()
      expect(screen.getByText('Visit Museum')).toBeInTheDocument()
      expect(screen.getByText('Alice Birthday')).toBeInTheDocument()
      expect(screen.getByText('B')).toBeInTheDocument()
    })

    it('should show task count badge when multiple types are present', () => {
      render(
        <GroupedView
          {...defaultProps}
          groupedToDoItems={[mockGroupedToDoItems[1]]}
          groupedAdventures={mockGroupedAdventures}
        />
      )

      expect(screen.getByText('1 task')).toBeInTheDocument()
    })
  })

  describe('When rendering with only adventures and no todos', () => {
    it('should render only adventure sections', () => {
      render(
        <GroupedView
          {...defaultProps}
          groupedToDoItems={[]}
          groupedAdventures={mockGroupedAdventures}
        />
      )

      expect(screen.getByText('Visit Museum')).toBeInTheDocument()
      expect(screen.queryByText('Overdue (2)')).not.toBeInTheDocument()
    })
  })
})
