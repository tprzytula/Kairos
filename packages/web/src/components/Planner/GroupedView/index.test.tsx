import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GroupedView from '.';
import { IGroupedTodoItem, IGroupedAdventureItem, TimeGroup } from '../utils/timeGrouping';

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
];

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
];

describe('Given the GroupedView component', () => {
  const mockOnSwipeAction = vi.fn();
  const mockOnEditAction = vi.fn();
  const mockOnAdventureClick = vi.fn();

  const defaultProps = {
    groupedToDoItems: mockGroupedToDoItems,
    groupedAdventures: [] as IGroupedAdventureItem[],
    allExpanded: true,
    expandKey: 0,
    onSwipeAction: mockOnSwipeAction,
    onEditAction: mockOnEditAction,
    onAdventureClick: mockOnAdventureClick,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('When rendering with grouped to-do items', () => {
    it('should display the time group sections with items', () => {
      render(<GroupedView {...defaultProps} />);

      expect(screen.getByText('Overdue (2)')).toBeInTheDocument();
      expect(screen.getByText('Due Today')).toBeInTheDocument();
      expect(screen.getByText('Overdue task 1')).toBeInTheDocument();
      expect(screen.getByText('Overdue task 2')).toBeInTheDocument();
      expect(screen.getByText('Today task')).toBeInTheDocument();
    });

    it('should display the appropriate time group icons', () => {
      render(<GroupedView {...defaultProps} />);

      expect(screen.getByText('⚠️')).toBeInTheDocument(); // Overdue emoji
      expect(screen.getByText('📅')).toBeInTheDocument(); // Today emoji
    });

    it('should render collapsible sections for each time group', () => {
      render(<GroupedView {...defaultProps} />);

      expect(screen.getAllByLabelText('Collapse')).toHaveLength(2);
    });

    it('should render the container with proper structure', () => {
      const { container } = render(<GroupedView {...defaultProps} />);

      const containerDiv = container.firstChild;
      expect(containerDiv).toBeInTheDocument();
    });
  });

  describe('When rendering with collapsible sections', () => {
    it('should render section headers', () => {
      render(
        <GroupedView
          {...defaultProps}
        />
      );

      expect(screen.getByText('Overdue (2)')).toBeInTheDocument();
      expect(screen.getByText('Due Today')).toBeInTheDocument();
    });
  });

  describe('When rendering with empty grouped to-do items', () => {
    it('should render without errors', () => {
      const { container } = render(
        <GroupedView {...defaultProps} groupedToDoItems={[]} />
      );

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('When rendering with grouped adventures', () => {
    it('should display the adventure sections', () => {
      render(
        <GroupedView {...defaultProps} groupedAdventures={mockGroupedAdventures} />
      );

      expect(screen.getByText('Today')).toBeInTheDocument();
      expect(screen.getByText('Visit Museum')).toBeInTheDocument();
    });

    it('should display the adventure section icon', () => {
      render(
        <GroupedView {...defaultProps} groupedAdventures={mockGroupedAdventures} />
      );

      expect(screen.getByText('🧭')).toBeInTheDocument();
    });

    it('should display adventure sections before todo sections', () => {
      render(
        <GroupedView {...defaultProps} groupedAdventures={mockGroupedAdventures} />
      );

      const allSectionTitles = screen.getAllByLabelText('Collapse');
      expect(allSectionTitles).toHaveLength(3);
    });

    it('should call onAdventureClick when an adventure is clicked', async () => {
      render(
        <GroupedView {...defaultProps} groupedAdventures={mockGroupedAdventures} />
      );

      await userEvent.click(screen.getByText('Visit Museum'));

      expect(mockOnAdventureClick).toHaveBeenCalledWith('adv-1');
    });
  });

  describe('When rendering with only adventures and no todos', () => {
    it('should render only adventure sections', () => {
      render(
        <GroupedView
          {...defaultProps}
          groupedToDoItems={[]}
          groupedAdventures={mockGroupedAdventures}
        />
      );

      expect(screen.getByText('Visit Museum')).toBeInTheDocument();
      expect(screen.queryByText('Overdue (2)')).not.toBeInTheDocument();
    });
  });
});
