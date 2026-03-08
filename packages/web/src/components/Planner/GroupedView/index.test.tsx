import { render, screen } from '@testing-library/react';
import GroupedView from '.';
import { IGroupedTodoItem, TimeGroup } from '../utils/timeGrouping';

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

describe('Given the GroupedView component', () => {
  const mockOnSwipeAction = jest.fn();
  const mockOnEditAction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('When rendering with grouped to-do items', () => {
    it('should display the time group sections with items', () => {
      render(
        <GroupedView
          groupedToDoItems={mockGroupedToDoItems}
          allExpanded={true}
          expandKey={0}
          onSwipeAction={mockOnSwipeAction}
          onEditAction={mockOnEditAction}
        />
      );

      expect(screen.getByText('Overdue (2)')).toBeInTheDocument();
      expect(screen.getByText('Due Today')).toBeInTheDocument();
      expect(screen.getByText('Overdue task 1')).toBeInTheDocument();
      expect(screen.getByText('Overdue task 2')).toBeInTheDocument();
      expect(screen.getByText('Today task')).toBeInTheDocument();
    });

    it('should display the appropriate time group icons', () => {
      render(
        <GroupedView
          groupedToDoItems={mockGroupedToDoItems}
          allExpanded={true}
          expandKey={0}
          onSwipeAction={mockOnSwipeAction}
          onEditAction={mockOnEditAction}
        />
      );

      expect(screen.getByText('⚠️')).toBeInTheDocument(); // Overdue emoji
      expect(screen.getByText('📅')).toBeInTheDocument(); // Today emoji
    });

    it('should render collapsible sections for each time group', () => {
      render(
        <GroupedView
          groupedToDoItems={mockGroupedToDoItems}
          allExpanded={true}
          expandKey={0}
          onSwipeAction={mockOnSwipeAction}
          onEditAction={mockOnEditAction}
        />
      );

      expect(screen.getAllByLabelText('Collapse')).toHaveLength(2);
    });

    it('should render the container with proper structure', () => {
      const { container } = render(
        <GroupedView
          groupedToDoItems={mockGroupedToDoItems}
          allExpanded={true}
          expandKey={0}
          onSwipeAction={mockOnSwipeAction}
          onEditAction={mockOnEditAction}
        />
      );

      const containerDiv = container.firstChild;
      expect(containerDiv).toBeInTheDocument();
    });
  });

  describe('When rendering with expand/collapse props', () => {
    it('should pass expand props to CollapsibleSections', () => {
      render(
        <GroupedView
          groupedToDoItems={mockGroupedToDoItems}
          allExpanded={false}
          expandKey="test-key"
          onSwipeAction={mockOnSwipeAction}
          onEditAction={mockOnEditAction}
        />
      );

      expect(screen.getByText('Overdue (2)')).toBeInTheDocument();
      expect(screen.getByText('Due Today')).toBeInTheDocument();
    });
  });

  describe('When rendering with empty grouped to-do items', () => {
    it('should render without errors', () => {
      const { container } = render(
        <GroupedView
          groupedToDoItems={[]}
          allExpanded={true}
          expandKey={0}
          onSwipeAction={mockOnSwipeAction}
          onEditAction={mockOnEditAction}
        />
      );

      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
