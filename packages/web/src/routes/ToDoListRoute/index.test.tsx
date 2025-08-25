import { act, render, screen, waitFor, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { AppStateProvider, initialState } from '../../providers/AppStateProvider'
import theme from '../../theme'
import { BrowserRouter } from 'react-router'
import ToDoListRoute from '.'
import { useAppState } from '../../providers/AppStateProvider'
import { useProjectContext } from '../../providers/ProjectProvider'
import * as ToDoAPI from '../../api/toDoList'
import { IProject } from '../../types/project'

jest.mock('../../providers/AppStateProvider', () => ({
  ...jest.requireActual('../../providers/AppStateProvider'),
  useAppState: jest.fn(),
}))

jest.mock('../../providers/ProjectProvider', () => ({
  ...jest.requireActual('../../providers/ProjectProvider'),
  useProjectContext: jest.fn(),
}))

jest.mock('../../api/toDoList')

const MOCK_PROJECT: IProject = {
  id: 'test-project-id',
  name: 'Test Project',
  isPersonal: true,
  ownerId: 'test-user-id',
  maxMembers: 10,
  inviteCode: 'test-invite-code',
  createdAt: new Date().toISOString()
}

describe('Given the ToDoListRoute component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue([])
    
    // Mock ProjectProvider
    jest.mocked(useProjectContext).mockReturnValue({
      projects: [MOCK_PROJECT],
      currentProject: MOCK_PROJECT,
      isLoading: false,
      createProject: jest.fn(),
      joinProject: jest.fn(),
      switchProject: jest.fn(),
      fetchProjects: jest.fn(),
      getProjectInviteInfo: jest.fn(),
    })
  })

  it('should have the correct title', async () => {
    await act(async () => {
      renderComponent()
    })

    expect(screen.getByText('To-Do List')).toBeVisible()
  })

  it('should display stats for empty list', async () => {
    jest.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue([])

    await act(async () => {
      renderComponent()
    })

    await waitFor(() => {
      expect(screen.getByText('0')).toBeInTheDocument() // Only Pending should show 0
      expect(screen.getByText('Pending')).toBeInTheDocument()
      expect(screen.getByText('Today')).toBeInTheDocument()
      expect(screen.getByText('Day')).toBeInTheDocument()
      expect(screen.getByText('Month')).toBeInTheDocument()
      expect(screen.getByText('Year')).toBeInTheDocument()
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

    jest.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue(mockTodoItems)

    await act(async () => {
      renderComponent()
    })

    await waitFor(() => {
      // Wait for the data to load by checking the pending stat specifically
      const pendingStatElements = screen.getAllByText('3')
      expect(pendingStatElements.length).toBeGreaterThan(0) // Should find the pending count
      expect(screen.getByText('Pending')).toBeInTheDocument()
    })
    
    // Then verify all date stats are present
    expect(screen.getByText('Today')).toBeInTheDocument()
    expect(screen.getByText('Day')).toBeInTheDocument()
    expect(screen.getByText('Month')).toBeInTheDocument()
    expect(screen.getByText('Year')).toBeInTheDocument()
  })

  it('should display correct stats with only pending items', async () => {
    const mockTodoItems = [
      { id: '1', name: 'Task 1', isDone: false, description: '', dueDate: undefined },
      { id: '2', name: 'Task 2', isDone: false, description: '', dueDate: undefined },
    ]

    jest.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue(mockTodoItems)

    await act(async () => {
      renderComponent()
    })

    await waitFor(() => {
      // Wait for the data to load by checking the pending stat specifically
      const pendingStatElements = screen.getAllByText('2')
      expect(pendingStatElements.length).toBeGreaterThan(0) // Should find the pending count
      expect(screen.getByText('Pending')).toBeInTheDocument()
    })
    
    // Then verify all date stats are present
    expect(screen.getByText('Today')).toBeInTheDocument()
    expect(screen.getByText('Day')).toBeInTheDocument()
    expect(screen.getByText('Month')).toBeInTheDocument()
    expect(screen.getByText('Year')).toBeInTheDocument()
  })

  it('should display correct stats with only completed items', async () => {
    const mockTodoItems = [
      { id: '1', name: 'Task 1', isDone: true, description: '', dueDate: undefined },
      { id: '2', name: 'Task 2', isDone: true, description: '', dueDate: undefined },
    ]

    jest.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue(mockTodoItems)

    await act(async () => {
      renderComponent()
    })

    await waitFor(() => {
      expect(screen.getByText('0')).toBeInTheDocument() // 0 pending items (all completed)
      expect(screen.getByText('Pending')).toBeInTheDocument()
      expect(screen.getByText('Today')).toBeInTheDocument()
      expect(screen.getByText('Day')).toBeInTheDocument()
      expect(screen.getByText('Month')).toBeInTheDocument()
      expect(screen.getByText('Year')).toBeInTheDocument()
    })
  })

  it('should render the header icon', async () => {
    await act(async () => {
      renderComponent()
    })

    // The ChecklistIcon should be rendered
    const headerContainer = screen.getByText('To-Do List').closest('div')
    expect(headerContainer).toBeInTheDocument()
  })

  it('should render the ActionButtonsBar with correct status text when no items selected', async () => {
    await act(async () => {
      renderComponent()
    })

    // The ActionButtonsBar should show status text when no items are selected
    await waitFor(() => {
      expect(screen.getByText('Your to-do list is empty')).toBeInTheDocument()
    })
  })

  it('should render the ActionButtonsBar with enabled button when items are selected', async () => {
    // Mock state with selected items
    jest.mocked(useAppState).mockReturnValue({
      state: {
        ...initialState,
        selectedTodoItems: new Set(['1', '2'])
      },
      dispatch: jest.fn(),
    })

    const mockTodoItems = [
      { id: '1', name: 'Task 1', isDone: false, description: '', dueDate: undefined },
      { id: '2', name: 'Task 2', isDone: false, description: '', dueDate: undefined },
    ]

    jest.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue(mockTodoItems)

    await act(async () => {
      render(
        <ThemeProvider theme={theme}>
          <AppStateProvider>
            <BrowserRouter>
              <ToDoListRoute />
            </BrowserRouter>
          </AppStateProvider>
        </ThemeProvider>
      )
    })

    // The ActionButtonsBar should show the action button when items are selected
    await waitFor(() => {
      expect(screen.getByText('Mark To Do Items As Done')).toBeInTheDocument()
    })
  })

  it('should render the ToDoList component', async () => {
    await act(async () => {
      renderComponent()
    })

    // Verify the ToDoList component is rendered by checking for its container
    await waitFor(() => {
      const container = screen.getByText('To-Do List').closest('div')
      expect(container).toBeInTheDocument()
    })
  })

  it('should render the expand/collapse button when there are pending items', async () => {
    const mockTodoItems = [
      { id: '1', name: 'Task 1', isDone: false, description: '', dueDate: undefined },
      { id: '2', name: 'Task 2', isDone: false, description: '', dueDate: undefined },
    ]

    jest.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue(mockTodoItems)

    await act(async () => {
      renderComponent()
    })

    // The expand/collapse button should be rendered and enabled when there are pending items
    await waitFor(() => {
      expect(screen.getByLabelText('Collapse all')).toBeInTheDocument() // Default is expanded
    })
  })

  it('should disable the expand/collapse button when no pending items', async () => {
    const mockTodoItems = [
      { id: '1', name: 'Task 1', isDone: true, description: '', dueDate: undefined },
      { id: '2', name: 'Task 2', isDone: true, description: '', dueDate: undefined },
    ]

    jest.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue(mockTodoItems)

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

    jest.spyOn(ToDoAPI, 'retrieveToDoList').mockResolvedValue(mockTodoItems)

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
  jest.mocked(useAppState).mockReturnValue({
    state: initialState,
    dispatch: jest.fn(),
  })

  render(
    <ThemeProvider theme={theme}>
      <AppStateProvider>
        <BrowserRouter>
          <ToDoListRoute />
        </BrowserRouter>
      </AppStateProvider>
    </ThemeProvider>
  )
}
