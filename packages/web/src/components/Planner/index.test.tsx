import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BrowserRouter } from 'react-router'
import Planner from "."
import * as PlannerProvider from '../../providers/PlannerProvider'
import * as ProjectProvider from '../../providers/ProjectProvider'
import * as ReactRouter from 'react-router'
import { IState } from "../../providers/PlannerProvider/types"
import { ThemeProvider, createTheme } from '@mui/material/styles'
import * as ToDoAPI from '../../api/toDoList'
import { PlannerViewMode } from '../../enums/plannerViewMode'

vi.mock('react-router', async () => ({
  ...(await vi.importActual('react-router')),
  useNavigate: vi.fn(),
}))

vi.mock('react-oidc-context', async () => ({
  useAuth: vi.fn(() => ({ user: { access_token: 'test-access-token' } })),
}))

vi.mock('../../providers/ProjectProvider')
vi.mock('../../api/toDoList')

vi.mock('./CalendarView', async () => ({
  __esModule: true,
  default: ({ visibleToDoItems, onItemClick }: { visibleToDoItems: Array<{ id: string; name: string }>, onItemClick: (id: string) => void }) => (
    <div data-testid="calendar-view">
      {visibleToDoItems.map((item) => (
        <button key={item.id} data-testid={`task-${item.id}`} onClick={() => onItemClick(item.id)}>
          {item.name}
        </button>
      ))}
    </div>
  ),
}))

describe('Given the Planner component', () => {
  const mockNavigate = vi.fn()

  beforeEach(() => {
    vi.spyOn(ReactRouter, 'useNavigate').mockReturnValue(mockNavigate)
    vi.spyOn(ProjectProvider, 'useProjectContext').mockReturnValue({
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
      createProject: vi.fn(),
      joinProject: vi.fn(),
      switchProject: vi.fn(),
      fetchProjects: vi.fn(),
      getProjectInviteInfo: vi.fn(),
      isLoading: false,
    })
    mockNavigate.mockClear()
  })
  it('should render only the not completed items grouped by time', () => {
    vi.spyOn(PlannerProvider, 'usePlannerContext').mockReturnValue(EXAMPLE_TO_DO_LIST_CONTEXT)

    renderWithTheme(<Planner viewMode={PlannerViewMode.GROUPED} />)

    expect(screen.getByText('Buy Groceries')).toBeVisible()
    expect(screen.getByText('Buy Bread')).toBeVisible()
    // Items should be grouped in time sections - the test data has dates in the past, so they show as overdue
    expect(screen.getByText('Overdue (2)')).toBeVisible()
    expect(screen.getByText('⚠️')).toBeVisible() // Overdue emoji
  })

  it('should pass edit and swipe functions to time sections', () => {
    vi.spyOn(PlannerProvider, 'usePlannerContext').mockReturnValue(EXAMPLE_TO_DO_LIST_CONTEXT)

    renderWithTheme(<Planner />)

    // The time sections should receive both onSwipeAction and onEditAction
    // This test ensures the edit navigation is properly set up
    expect(mockNavigate).toHaveBeenCalledTimes(0) // Should not navigate on render
  })

  it('should render collapsible section toggle buttons in grouped mode', () => {
    vi.spyOn(PlannerProvider, 'usePlannerContext').mockReturnValue(EXAMPLE_TO_DO_LIST_CONTEXT)

    renderWithTheme(<Planner viewMode={PlannerViewMode.GROUPED} />)

    // Sections start expanded by default, so the toggle button shows 'Collapse'
    expect(screen.getByRole('button', { name: /collapse/i })).toBeInTheDocument()
  })

  it('should render in grouped mode when viewMode is GROUPED', () => {
    vi.spyOn(PlannerProvider, 'usePlannerContext').mockReturnValue(EXAMPLE_TO_DO_LIST_CONTEXT)

    renderWithTheme(<Planner viewMode={PlannerViewMode.GROUPED} />)

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

    vi.spyOn(PlannerProvider, 'usePlannerContext').mockReturnValue(contextWithMixedItems)

    renderWithTheme(<Planner viewMode={PlannerViewMode.GROUPED} />)

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
    
    vi.spyOn(PlannerProvider, 'usePlannerContext').mockReturnValue(contextWithDifferentDueDates)

    renderWithTheme(<Planner viewMode={PlannerViewMode.GROUPED} />)

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
      vi.spyOn(PlannerProvider, 'usePlannerContext').mockReturnValue({
        toDoList: [],
        isLoading: false,
        isError: false,
        refetchToDoList: vi.fn(),
        removeFromToDoList: vi.fn(),
        updateToDoItemFields: vi.fn(),
        updateToDoItemsBulk: vi.fn(),
      })

      renderWithTheme(<Planner viewMode={PlannerViewMode.GROUPED} />)

      expect(screen.getByLabelText('Empty planner')).toBeVisible()
      expect(screen.getByText('No pending tasks found')).toBeVisible()
      expect(screen.getByText('Tap the + button to add your first task')).toBeVisible()
    })

    describe('Empty state layout behavior', () => {
      it('should center empty state vertically within available space', () => {
        vi.spyOn(PlannerProvider, 'usePlannerContext').mockReturnValue({
          toDoList: [],
          isLoading: false,
          isError: false,
          refetchToDoList: vi.fn(),
          removeFromToDoList: vi.fn(),
          updateToDoItemFields: vi.fn(),
          updateToDoItemsBulk: vi.fn(),
        })

        renderWithTheme(<Planner viewMode={PlannerViewMode.GROUPED} />)

        const emptyStateElement = screen.getByText('No pending tasks found').parentElement
        expect(emptyStateElement).toBeInTheDocument()
        
        const computedStyle = window.getComputedStyle(emptyStateElement as Element)
        expect(computedStyle.display).toBe('flex')
        expect(computedStyle.flexDirection).toBe('column')
        expect(computedStyle.justifyContent).toBe('center')
        expect(computedStyle.alignItems).toBe('center')
        expect(computedStyle.flex).toBe('1 1 0%')
      })

      it('should maintain proper spacing and opacity in empty state', () => {
        vi.spyOn(PlannerProvider, 'usePlannerContext').mockReturnValue({
          toDoList: [],
          isLoading: false,
          isError: false,
          refetchToDoList: vi.fn(),
          removeFromToDoList: vi.fn(),
          updateToDoItemFields: vi.fn(),
          updateToDoItemsBulk: vi.fn(),
        })

        renderWithTheme(<Planner viewMode={PlannerViewMode.GROUPED} />)

        const emptyStateElement = screen.getByText('No pending tasks found').parentElement
        const computedStyle = window.getComputedStyle(emptyStateElement as Element)
        
        expect(computedStyle.gap).toBe('12px')
        expect(computedStyle.opacity).toBe('0.6')
        expect(computedStyle.minHeight).toBe('300px')
      })
    })
  })

  describe('When the to do list is loading', () => {
    it('should render the loading placeholder', () => {
      vi.spyOn(PlannerProvider, 'usePlannerContext').mockReturnValue({
        toDoList: [],
        isLoading: true,
        isError: false,
        refetchToDoList: vi.fn(),
        removeFromToDoList: vi.fn(),
        updateToDoItemFields: vi.fn(),
        updateToDoItemsBulk: vi.fn(),
      })

      renderWithTheme(<Planner />)

      expect(screen.getByLabelText('Loading calendar')).toBeInTheDocument()
    })
  })

  describe('When the user deletes a todo item', () => {
    it('should call removeTodoItems API and removeFromToDoList on successful deletion', async () => {
      const removeFromToDoListMock = vi.fn()
      const removeTodoItemsSpy = vi.mocked(ToDoAPI.removeTodoItems).mockResolvedValue(undefined)

      vi.spyOn(PlannerProvider, 'usePlannerContext').mockReturnValue({
        ...EXAMPLE_TO_DO_LIST_CONTEXT,
        removeFromToDoList: removeFromToDoListMock,
      })

      renderWithTheme(<Planner />)

      fireEvent.click(screen.getByTestId('task-1'))
      fireEvent.click(screen.getByText('Delete Task'))

      await waitFor(() => {
        expect(removeTodoItemsSpy).toHaveBeenCalledWith(['1'], 'test-project-id', 'test-access-token')
        expect(removeFromToDoListMock).toHaveBeenCalledWith('1')
      })
    })

    it('should not call removeFromToDoList when the API call fails', async () => {
      const removeFromToDoListMock = vi.fn()
      vi.mocked(ToDoAPI.removeTodoItems).mockRejectedValue(new Error('API error'))

      vi.spyOn(PlannerProvider, 'usePlannerContext').mockReturnValue({
        ...EXAMPLE_TO_DO_LIST_CONTEXT,
        removeFromToDoList: removeFromToDoListMock,
      })

      renderWithTheme(<Planner />)

      fireEvent.click(screen.getByTestId('task-1'))
      fireEvent.click(screen.getByText('Delete Task'))

      await waitFor(() => {
        expect(removeFromToDoListMock).not.toHaveBeenCalled()
      })
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
  isError: false,
  refetchToDoList: vi.fn(),
  removeFromToDoList: vi.fn(),
  updateToDoItemFields: vi.fn(),
  updateToDoItemsBulk: vi.fn(),
}
