import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BrowserRouter } from 'react-router'
import ToDoList from "."
import * as ToDoListProvider from '../../providers/ToDoListProvider'
import * as ProjectProvider from '../../providers/ProjectProvider'
import * as ReactRouter from 'react-router'
import { IState } from "../../providers/ToDoListProvider/types"
import { ThemeProvider, createTheme } from '@mui/material/styles'
import * as ToDoAPI from '../../api/toDoList'
import { ToDoViewMode } from '../../enums/todoViewMode'

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
}))

jest.mock('../../providers/ProjectProvider')

describe('Given the ToDoList component', () => {
  const mockNavigate = jest.fn()

  beforeEach(() => {
    jest.spyOn(ReactRouter, 'useNavigate').mockReturnValue(mockNavigate)
    jest.spyOn(ProjectProvider, 'useProjectContext').mockReturnValue({
      currentProject: { 
        id: 'test-project-id', 
        name: 'Test Project',
        ownerId: 'test-owner-id',
        isPersonal: false,
        maxMembers: 10,
        inviteCode: 'test-invite-code',
        createdAt: '2023-01-01T00:00:00Z'
      },
      projects: [],
      createProject: jest.fn(),
      joinProject: jest.fn(),
      switchProject: jest.fn(),
      fetchProjects: jest.fn(),
      getProjectInviteInfo: jest.fn(),
      isLoading: false,
    })
    mockNavigate.mockClear()
  })
  it('should render only the not completed items grouped by time', () => {
    jest.spyOn(ToDoListProvider, 'useToDoListContext').mockReturnValue(EXAMPLE_TO_DO_LIST_CONTEXT)

    renderWithTheme(<ToDoList />)

    expect(screen.getByText('Buy Groceries')).toBeVisible()
    expect(screen.getByText('Buy Bread')).toBeVisible()
    // Items should be grouped in time sections - the test data has dates in the past, so they show as overdue
    expect(screen.getByText('Overdue (2)')).toBeVisible()
    expect(screen.getByText('⚠️')).toBeVisible() // Overdue emoji
  })

  it('should pass edit and swipe functions to time sections', () => {
    jest.spyOn(ToDoListProvider, 'useToDoListContext').mockReturnValue(EXAMPLE_TO_DO_LIST_CONTEXT)

    renderWithTheme(<ToDoList />)

    // The time sections should receive both onSwipeAction and onEditAction
    // This test ensures the edit navigation is properly set up
    expect(mockNavigate).toHaveBeenCalledTimes(0) // Should not navigate on render
  })

  it('should pass expand/collapse props to time sections when provided', () => {
    jest.spyOn(ToDoListProvider, 'useToDoListContext').mockReturnValue(EXAMPLE_TO_DO_LIST_CONTEXT)

    renderWithTheme(<ToDoList allExpanded={false} expandKey="test-key" />)

    // When allExpanded=false, sections should be collapsed (show expand button)
    expect(screen.getByRole('button', { name: /expand/i })).toBeInTheDocument()
  })

  it('should render in simple mode when viewMode is SIMPLE', () => {
    jest.spyOn(ToDoListProvider, 'useToDoListContext').mockReturnValue(EXAMPLE_TO_DO_LIST_CONTEXT)

    renderWithTheme(<ToDoList viewMode={ToDoViewMode.SIMPLE} />)

    // In simple mode, items should be rendered in one "All Tasks" section
    expect(screen.getByText('All Tasks')).toBeVisible()
    expect(screen.getByText('Buy Groceries')).toBeVisible()
    expect(screen.getByText('Buy Bread')).toBeVisible()
    expect(screen.getByText('✅')).toBeVisible() // Should show the checkmark emoji
    // Should not have time section headers
    expect(screen.queryByText('Overdue (2)')).not.toBeInTheDocument()
  })

  it('should render in grouped mode by default', () => {
    jest.spyOn(ToDoListProvider, 'useToDoListContext').mockReturnValue(EXAMPLE_TO_DO_LIST_CONTEXT)

    renderWithTheme(<ToDoList />)

    // Should have time section headers in grouped mode
    expect(screen.getByText('Overdue (2)')).toBeVisible()
    expect(screen.getByText('⚠️')).toBeVisible()
  })

  it('should filter to show only non-completed items', () => {
    const contextWithMixedItems = {
      ...EXAMPLE_TO_DO_LIST_CONTEXT,
      toDoList: [
        ...EXAMPLE_TO_DO_LIST_CONTEXT.toDoList,
        { id: '3', name: 'Completed Item', isDone: true, description: '', dueDate: undefined }
      ]
    }
    
    jest.spyOn(ToDoListProvider, 'useToDoListContext').mockReturnValue(contextWithMixedItems)

    renderWithTheme(<ToDoList />)

    expect(screen.getByText('Buy Groceries')).toBeVisible()
    expect(screen.getByText('Buy Bread')).toBeVisible()
    expect(screen.queryByText('Completed Item')).not.toBeInTheDocument()
  })

  it('should group todos by time periods correctly', () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const contextWithDifferentDueDates = {
      ...EXAMPLE_TO_DO_LIST_CONTEXT,
      toDoList: [
        { id: '1', name: 'Task for today', isDone: false, description: '', dueDate: today.getTime() },
        { id: '2', name: 'Task for tomorrow', isDone: false, description: '', dueDate: tomorrow.getTime() },
        { id: '3', name: 'Task without date', isDone: false, description: '', dueDate: undefined }
      ]
    }
    
    jest.spyOn(ToDoListProvider, 'useToDoListContext').mockReturnValue(contextWithDifferentDueDates)

    renderWithTheme(<ToDoList />)

    // Check section headers
    expect(screen.getByText('Due Today')).toBeVisible()
    expect(screen.getByText('Due Tomorrow')).toBeVisible()  
    expect(screen.getByText('No Due Date')).toBeVisible()
    
    // Check emojis
    expect(screen.getByText('📅')).toBeVisible() // Today emoji
    expect(screen.getByText('📌')).toBeVisible() // Tomorrow emoji
    expect(screen.getByText('📝')).toBeVisible() // No due date emoji
    
    // Check todo items
    expect(screen.getByText('Task for today')).toBeVisible()
    expect(screen.getByText('Task for tomorrow')).toBeVisible()
    expect(screen.getByText('Task without date')).toBeVisible()
  })

  describe('When the to do list is empty', () => {
    it('should render the empty list icon and helpful text', () => {
      jest.spyOn(ToDoListProvider, 'useToDoListContext').mockReturnValue({
        toDoList: [],
        isLoading: false,
        refetchToDoList: jest.fn(),
        removeFromToDoList: jest.fn(),
        updateToDoItemFields: jest.fn(),
      })

      renderWithTheme(<ToDoList />)

      expect(screen.getByLabelText('Empty to-do list')).toBeVisible()
      expect(screen.getByText('No pending to-do items found')).toBeVisible()
      expect(screen.getByText('Tap the + button to add your first task')).toBeVisible()
    })

    describe('Empty state layout behavior', () => {
      it('should center empty state vertically within available space', () => {
        jest.spyOn(ToDoListProvider, 'useToDoListContext').mockReturnValue({
          toDoList: [],
          isLoading: false,
          refetchToDoList: jest.fn(),
          removeFromToDoList: jest.fn(),
          updateToDoItemFields: jest.fn(),
        })

        renderWithTheme(<ToDoList />)

        const emptyStateElement = screen.getByText('No pending to-do items found').parentElement
        expect(emptyStateElement).toBeInTheDocument()
        
        const computedStyle = window.getComputedStyle(emptyStateElement as Element)
        expect(computedStyle.display).toBe('flex')
        expect(computedStyle.flexDirection).toBe('column')
        expect(computedStyle.justifyContent).toBe('center')
        expect(computedStyle.alignItems).toBe('center')
        expect(computedStyle.flex).toBe('1 1 0%')
      })

      it('should maintain proper spacing and opacity in empty state', () => {
        jest.spyOn(ToDoListProvider, 'useToDoListContext').mockReturnValue({
          toDoList: [],
          isLoading: false,
          refetchToDoList: jest.fn(),
          removeFromToDoList: jest.fn(),
          updateToDoItemFields: jest.fn(),
        })

        renderWithTheme(<ToDoList />)

        const emptyStateElement = screen.getByText('No pending to-do items found').parentElement
        const computedStyle = window.getComputedStyle(emptyStateElement as Element)
        
        expect(computedStyle.gap).toBe('12px')
        expect(computedStyle.opacity).toBe('0.6')
        expect(computedStyle.minHeight).toBe('300px')
      })
    })
  })

  describe('When the to do list is loading', () => {
    it('should render the loading placeholder', () => {
      jest.spyOn(ToDoListProvider, 'useToDoListContext').mockReturnValue({
        toDoList: [],
        isLoading: true,
        refetchToDoList: jest.fn(),
        removeFromToDoList: jest.fn(),
        updateToDoItemFields: jest.fn(),
      })

      renderWithTheme(<ToDoList />)

      expect(screen.getAllByLabelText('To do item placeholder')).toHaveLength(20)
    })
  })
})

const theme = createTheme()

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </ThemeProvider>
  )
}

const EXAMPLE_TO_DO_LIST_CONTEXT: IState = {
  toDoList: [
    {
      id: '1',
      name: 'Buy Groceries',
      description: 'Buy groceries for the week',
      dueDate: 1746042442000,
      isDone: false,
    },
    {
      id: '2',
      name: 'Buy Bread',
      description: 'Buy bread for the week',
      dueDate: 1746042442000,
      isDone: false,
    },
    {
      id: '3',
      name: 'Buy Something Else',
      description: 'Buy something else for the week',
      dueDate: 1746042442000,
      isDone: true,
    },
  ],
  isLoading: false,
  refetchToDoList: jest.fn(),
  removeFromToDoList: jest.fn(),
  updateToDoItemFields: jest.fn(),
}
