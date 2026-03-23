import { act, render, screen, waitFor, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppStateProvider, initialState } from '../../providers/AppStateProvider'
import theme from '../../theme'
import { BrowserRouter } from 'react-router'
import PlannerRoute from '.'
import { useAppState } from '../../providers/AppStateProvider'
import { useProjectContext } from '../../providers/ProjectProvider'
import * as ToDoAPI from '../../api/toDoList'
import { IProject } from '../../types/project'

const createTestQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } })

vi.mock('../../providers/AppStateProvider', async () => ({
  ...(await vi.importActual('../../providers/AppStateProvider')),
  useAppState: vi.fn(),
}))

vi.mock('../../providers/ProjectProvider', async () => ({
  ...(await vi.importActual('../../providers/ProjectProvider')),
  useProjectContext: vi.fn(),
}))

vi.mock('../../api/toDoList')

vi.mock('react-oidc-context', async () => ({
  useAuth: vi.fn(() => ({ user: { access_token: 'test-access-token' } })),
}))

const MOCK_PROJECT: IProject = {
  id: 'test-project-id',
  name: 'Test Project',
  isPersonal: true,
  ownerId: 'test-user-id',
  maxMembers: 10,
  inviteCode: 'test-invite-code',
  createdAt: new Date().toISOString()
}

describe('Given the PlannerRoute component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue([])
    
    // Mock ProjectProvider
    vi.mocked(useProjectContext).mockReturnValue({
      projects: [MOCK_PROJECT],
      currentProject: MOCK_PROJECT,
      isLoading: false,
      createProject: vi.fn(),
      joinProject: vi.fn(),
      switchProject: vi.fn(),
      fetchProjects: vi.fn(),
      getProjectInviteInfo: vi.fn(),
    })
  })

  it('should have the correct title', async () => {
    await act(async () => {
      renderComponent()
    })

    expect(screen.getByText('Planner')).toBeVisible()
  })

  it('should display stats for empty list', async () => {
    vi.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue([])

    await act(async () => {
      renderComponent()
    })

    await waitFor(() => {
      expect(screen.getByText('Pending')).toBeInTheDocument()
      expect(screen.getByText('Overdue')).toBeInTheDocument()
      expect(screen.getByText('Done')).toBeInTheDocument()
      expect(screen.getByText('No Date')).toBeInTheDocument()
    })
  })

  it('should display correct stats with mixed items', async () => {
    const mockTodoItems = [
      { id: '1', name: 'Task 1', isDone: false, description: '', dueDate: undefined },
      { id: '2', name: 'Task 2', isDone: true, description: '', dueDate: undefined },
      { id: '3', name: 'Task 3', isDone: false, description: '', dueDate: undefined },
      { id: '4', name: 'Task 4', isDone: true, description: '', dueDate: undefined },
      { id: '5', name: 'Task 5', isDone: false, description: '', dueDate: undefined },
    ]

    vi.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue(mockTodoItems)

    await act(async () => {
      renderComponent()
    })

    await waitFor(() => {
      // Wait for the data to load by checking the pending stat specifically
      const pendingStatElements = screen.getAllByText('3')
      expect(pendingStatElements.length).toBeGreaterThan(0) // Should find the pending count
      expect(screen.getByText('Pending')).toBeInTheDocument()
    })

    // Then verify all calendar stats are present
    expect(screen.getByText('Overdue')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
    expect(screen.getByText('No Date')).toBeInTheDocument()
  })

  it('should display correct stats with only pending items', async () => {
    const mockTodoItems = [
      { id: '1', name: 'Task 1', isDone: false, description: '', dueDate: undefined },
      { id: '2', name: 'Task 2', isDone: false, description: '', dueDate: undefined },
    ]

    vi.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue(mockTodoItems)

    await act(async () => {
      renderComponent()
    })

    await waitFor(() => {
      // Wait for the data to load by checking the pending stat specifically
      const pendingStatElements = screen.getAllByText('2')
      expect(pendingStatElements.length).toBeGreaterThan(0) // Should find the pending count
      expect(screen.getByText('Pending')).toBeInTheDocument()
    })

    // Then verify all calendar stats are present
    expect(screen.getByText('Overdue')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
    expect(screen.getByText('No Date')).toBeInTheDocument()
  })

  it('should display correct stats with only completed items', async () => {
    const mockTodoItems = [
      { id: '1', name: 'Task 1', isDone: true, description: '', dueDate: undefined },
      { id: '2', name: 'Task 2', isDone: true, description: '', dueDate: undefined },
    ]

    vi.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue(mockTodoItems)

    await act(async () => {
      renderComponent()
    })

    await waitFor(() => {
      expect(screen.getByText('Pending')).toBeInTheDocument()
      expect(screen.getByText('Overdue')).toBeInTheDocument()
      expect(screen.getByText('Done')).toBeInTheDocument()
      expect(screen.getByText('No Date')).toBeInTheDocument()
    })
  })

  it('should render the header icon', async () => {
    await act(async () => {
      renderComponent()
    })

    // The ChecklistIcon should be rendered
    const headerContainer = screen.getByText('Planner').closest('div')
    expect(headerContainer).toBeInTheDocument()
  })

  it('should render the ActionButtonsBar with correct status text when no items selected', async () => {
    await act(async () => {
      renderComponent()
    })

    // The ActionButtonsBar should show status text when no items are selected
    await waitFor(() => {
      expect(screen.getByText('Your planner is empty')).toBeInTheDocument()
    })
  })

  it('should render the ActionButtonsBar with enabled button when items are selected', async () => {
    // Mock state with selected items
    vi.mocked(useAppState).mockReturnValue({
      state: {
        ...initialState,
        selectedTodoItems: new Set(['1', '2'])
      },
      dispatch: vi.fn(),
    })

    const mockTodoItems = [
      { id: '1', name: 'Task 1', isDone: false, description: '', dueDate: undefined },
      { id: '2', name: 'Task 2', isDone: false, description: '', dueDate: undefined },
    ]

    vi.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue(mockTodoItems)

    const queryClient = createTestQueryClient()
    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <AppStateProvider>
              <BrowserRouter>
                <PlannerRoute />
              </BrowserRouter>
            </AppStateProvider>
          </ThemeProvider>
        </QueryClientProvider>
      )
    })

    // The ActionButtonsBar should show the action button when items are selected
    await waitFor(() => {
      expect(screen.getByText('Mark Tasks As Done')).toBeInTheDocument()
    })
  })

  it('should render the ToDoList component', async () => {
    await act(async () => {
      renderComponent()
    })

    // Verify the ToDoList component is rendered by checking for its container
    await waitFor(() => {
      const container = screen.getByText('Planner').closest('div')
      expect(container).toBeInTheDocument()
    })
  })

  it('should render the expand/collapse button (disabled in weekly view)', async () => {
    const mockTodoItems = [
      { id: '1', name: 'Task 1', isDone: false, description: '', dueDate: undefined },
      { id: '2', name: 'Task 2', isDone: false, description: '', dueDate: undefined },
    ]

    vi.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue(mockTodoItems)

    await act(async () => {
      renderComponent()
    })

    // The expand/collapse button should be rendered but disabled in the default calendar view
    await waitFor(() => {
      expect(screen.getByLabelText('Collapse all')).toBeInTheDocument()
      expect(screen.getByLabelText('Collapse all')).toBeDisabled()
    })
  })

  it('should disable the expand/collapse button when no pending items', async () => {
    const mockTodoItems = [
      { id: '1', name: 'Task 1', isDone: true, description: '', dueDate: undefined },
      { id: '2', name: 'Task 2', isDone: true, description: '', dueDate: undefined },
    ]

    vi.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue(mockTodoItems)

    await act(async () => {
      renderComponent()
    })

    // The expand/collapse button should be disabled when no pending items
    await waitFor(() => {
      const expandButton = screen.getByLabelText('Collapse all')
      expect(expandButton).toBeDisabled()
    })
  })

  it('should render the view toggle button', async () => {
    const mockTodoItems = [
      { id: '1', name: 'Task 1', isDone: false, description: '', dueDate: undefined },
    ]

    vi.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue(mockTodoItems)

    await act(async () => {
      renderComponent()
    })

    // The view toggle button should be rendered
    await waitFor(() => {
      expect(screen.getByLabelText('Toggle view mode')).toBeInTheDocument()
    })
  })


})

const renderComponent = () => {
  vi.mocked(useAppState).mockReturnValue({
    state: initialState,
    dispatch: vi.fn(),
  })

  const queryClient = createTestQueryClient()
  render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AppStateProvider>
          <BrowserRouter>
            <PlannerRoute />
          </BrowserRouter>
        </AppStateProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
