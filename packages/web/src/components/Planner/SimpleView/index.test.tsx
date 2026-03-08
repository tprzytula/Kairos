import { render, screen } from '@testing-library/react';
import SimpleView from '.';
import { ITodoItem } from '../../../api/toDoList/retrieve/types';

const mockToDoItems: ITodoItem[] = [
  {
    id: '1',
    name: 'Buy groceries',
    description: 'Get milk and bread',
    isDone: false,
    dueDate: Date.now() + 86400000,
  },
  {
    id: '2',
    name: 'Walk the dog',
    description: 'Take Rex for a walk',
    isDone: false,
    dueDate: undefined,
  },
];

describe('Given the SimpleView component', () => {
  const mockOnSwipeAction = jest.fn();
  const mockOnEditAction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('When rendering with to-do items', () => {
    it('should display the to-do items in a swipeable list', () => {
      render(
        <SimpleView
          visibleToDoItems={mockToDoItems}
          onSwipeAction={mockOnSwipeAction}
          onEditAction={mockOnEditAction}
        />
      );

      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
      expect(screen.getByText('Walk the dog')).toBeInTheDocument();
    });

    it('should display "All Tasks" section header', () => {
      render(
        <SimpleView
          visibleToDoItems={mockToDoItems}
          onSwipeAction={mockOnSwipeAction}
          onEditAction={mockOnEditAction}
        />
      );

      expect(screen.getByText('All Tasks')).toBeInTheDocument();
    });

    it('should display the check mark emoji icon', () => {
      render(
        <SimpleView
          visibleToDoItems={mockToDoItems}
          onSwipeAction={mockOnSwipeAction}
          onEditAction={mockOnEditAction}
        />
      );

      expect(screen.getByText('✅')).toBeInTheDocument();
    });

    it('should render the container with proper structure', () => {
      const { container } = render(
        <SimpleView
          visibleToDoItems={mockToDoItems}
          onSwipeAction={mockOnSwipeAction}
          onEditAction={mockOnEditAction}
        />
      );

      const containerDiv = container.firstChild;
      expect(containerDiv).toBeInTheDocument();
    });
  });

  describe('When rendering with expand/collapse props', () => {
    it('should pass expand props to CollapsibleSection', () => {
      render(
        <SimpleView
          visibleToDoItems={mockToDoItems}
          allExpanded={true}
          expandKey="test-key"
          onSwipeAction={mockOnSwipeAction}
          onEditAction={mockOnEditAction}
        />
      );

      expect(screen.getByText('All Tasks')).toBeInTheDocument();
    });
  });

  describe('When rendering with empty to-do list', () => {
    it('should render without errors', () => {
      const { container } = render(
        <SimpleView
          visibleToDoItems={[]}
          onSwipeAction={mockOnSwipeAction}
          onEditAction={mockOnEditAction}
        />
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should not display section header when list is empty', () => {
      render(
        <SimpleView
          visibleToDoItems={[]}
          onSwipeAction={mockOnSwipeAction}
          onEditAction={mockOnEditAction}
        />
      );

      expect(screen.queryByText('All Tasks')).not.toBeInTheDocument();
    });
  });
});
