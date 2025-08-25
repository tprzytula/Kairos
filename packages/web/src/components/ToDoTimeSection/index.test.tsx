import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import ToDoTimeSection from './index'
import { TimeGroup } from '../ToDoList/utils/timeGrouping'
import { ITodoItem } from '../../api/toDoList/retrieve/types'
import theme from '../../theme'

const mockTodoItems: ITodoItem[] = [
  {
    id: '1',
    name: 'Test todo 1',
    description: 'Test description 1',
    isDone: false,
    dueDate: Date.now()
  },
  {
    id: '2', 
    name: 'Test todo 2',
    description: 'Test description 2',
    isDone: false,
    dueDate: Date.now() + 86400000
  }
]

const testTheme = createTheme({
  palette: {
    background: {
      paper: '#ffffff',
      default: '#f5f5f5'
    },
    text: {
      primary: '#333333',
      secondary: '#666666'
    }
  }
})

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={testTheme}>
      {component}
    </ThemeProvider>
  )
}

describe('ToDoTimeSection component', () => {
  describe('when rendering with items', () => {
    const mockOnSwipeAction = jest.fn()
    const mockOnEditAction = jest.fn()

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should display the section header with group label and item count', () => {
      renderWithTheme(
        <ToDoTimeSection
          group={TimeGroup.TODAY}
          groupLabel="Due Today"
          items={mockTodoItems}
          onSwipeAction={mockOnSwipeAction}
          onEditAction={mockOnEditAction}
        />
      )

      expect(screen.getByText('Due Today')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
    })

    it('should display the correct emoji for the time group', () => {
      renderWithTheme(
        <ToDoTimeSection
          group={TimeGroup.TODAY}
          groupLabel="Due Today"
          items={mockTodoItems}
          onSwipeAction={mockOnSwipeAction}
          onEditAction={mockOnEditAction}
        />
      )

      expect(screen.getByText('📅')).toBeInTheDocument()
    })

    it('should render todo items when expanded', () => {
      renderWithTheme(
        <ToDoTimeSection
          group={TimeGroup.TODAY}
          groupLabel="Due Today"
          items={mockTodoItems}
          onSwipeAction={mockOnSwipeAction}
          onEditAction={mockOnEditAction}
        />
      )

      expect(screen.getByText('Test todo 1')).toBeInTheDocument()
      expect(screen.getByText('Test todo 2')).toBeInTheDocument()
    })

    it('should toggle expanded state when header is clicked', () => {
      renderWithTheme(
        <ToDoTimeSection
          group={TimeGroup.TODAY}
          groupLabel="Due Today"
          items={mockTodoItems}
          onSwipeAction={mockOnSwipeAction}
          onEditAction={mockOnEditAction}
        />
      )

      const header = screen.getByRole('button', { name: /collapse/i })
      
      // Items should be visible initially
      expect(screen.getByText('Test todo 1')).toBeInTheDocument()
      
      // Click to collapse
      fireEvent.click(header)
      
      // Check that the aria-label changed to indicate collapsed state
      expect(screen.getByRole('button', { name: /expand/i })).toBeInTheDocument()
    })

    it('should show correct aria-label for expand/collapse button', () => {
      renderWithTheme(
        <ToDoTimeSection
          group={TimeGroup.TODAY}
          groupLabel="Due Today"
          items={mockTodoItems}
          onSwipeAction={mockOnSwipeAction}
          onEditAction={mockOnEditAction}
        />
      )

      const expandButton = screen.getByRole('button', { name: /collapse/i })
      expect(expandButton).toBeInTheDocument()

      fireEvent.click(expandButton)
      
      const collapseButton = screen.getByRole('button', { name: /expand/i })
      expect(collapseButton).toBeInTheDocument()
    })
  })

  describe('when expandTo prop is provided', () => {
    const mockOnSwipeAction = jest.fn()
    const mockOnEditAction = jest.fn()

    it('should set expanded state to collapsed when expandTo is false', () => {
      renderWithTheme(
        <ToDoTimeSection
          group={TimeGroup.TODAY}
          groupLabel="Due Today"
          items={mockTodoItems}
          onSwipeAction={mockOnSwipeAction}
          onEditAction={mockOnEditAction}
          expandTo={false}
          expandKey="test-key-1"
        />
      )

      // Should be collapsed due to expandTo=false - check via aria-label
      expect(screen.getByRole('button', { name: /expand/i })).toBeInTheDocument()
    })

    it('should set expanded state to expanded when expandTo is true', () => {
      renderWithTheme(
        <ToDoTimeSection
          group={TimeGroup.TODAY}
          groupLabel="Due Today"
          items={mockTodoItems}
          onSwipeAction={mockOnSwipeAction}
          onEditAction={mockOnEditAction}
          expandTo={true}
          expandKey="test-key-2"
        />
      )

      // Should be expanded due to expandTo=true - check via aria-label
      expect(screen.getByRole('button', { name: /collapse/i })).toBeInTheDocument()
      expect(screen.getByText('Test todo 1')).toBeInTheDocument()
    })
  })

  describe('when no items are provided', () => {
    const mockOnSwipeAction = jest.fn()
    const mockOnEditAction = jest.fn()

    it('should not render anything when items array is empty', () => {
      const { container } = renderWithTheme(
        <ToDoTimeSection
          group={TimeGroup.TODAY}
          groupLabel="Due Today"
          items={[]}
          onSwipeAction={mockOnSwipeAction}
          onEditAction={mockOnEditAction}
        />
      )

      expect(container.firstChild).toBeNull()
    })
  })

  describe('for different time groups', () => {
    const mockOnSwipeAction = jest.fn()
    const mockOnEditAction = jest.fn()
    const singleItem = [mockTodoItems[0]]

    it('should render overdue section with warning emoji', () => {
      renderWithTheme(
        <ToDoTimeSection
          group={TimeGroup.OVERDUE}
          groupLabel="Overdue"
          items={singleItem}
          onSwipeAction={mockOnSwipeAction}
          onEditAction={mockOnEditAction}
        />
      )

      expect(screen.getByText('⚠️')).toBeInTheDocument()
      expect(screen.getByText('Overdue')).toBeInTheDocument()
    })

    it('should render tomorrow section with pin emoji', () => {
      renderWithTheme(
        <ToDoTimeSection
          group={TimeGroup.TOMORROW}
          groupLabel="Due Tomorrow"
          items={singleItem}
          onSwipeAction={mockOnSwipeAction}
          onEditAction={mockOnEditAction}
        />
      )

      expect(screen.getByText('📌')).toBeInTheDocument()
      expect(screen.getByText('Due Tomorrow')).toBeInTheDocument()
    })

    it('should render no due date section with note emoji', () => {
      renderWithTheme(
        <ToDoTimeSection
          group={TimeGroup.NO_DUE_DATE}
          groupLabel="No Due Date"
          items={singleItem}
          onSwipeAction={mockOnSwipeAction}
          onEditAction={mockOnEditAction}
        />
      )

      expect(screen.getByText('📝')).toBeInTheDocument()
      expect(screen.getByText('No Due Date')).toBeInTheDocument()
    })
  })
})
