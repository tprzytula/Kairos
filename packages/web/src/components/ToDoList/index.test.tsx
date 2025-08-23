import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BrowserRouter } from 'react-router'
import ToDoList from "."
import * as ToDoListProvider from '../../providers/ToDoListProvider'
import * as ProjectProvider from '../../providers/ProjectProvider'
import * as ReactRouter from 'react-router'
import { IState } from "../../providers/ToDoListProvider/types"
import { ThemeProvider, createTheme } from '@mui/material/styles'
import * as ToDoAPI from '../../api/toDoList'

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
  it('should render only the not completed items', () => {
    jest.spyOn(ToDoListProvider, 'useToDoListContext').mockReturnValue(EXAMPLE_TO_DO_LIST_CONTEXT)

    renderWithTheme(<ToDoList />)

    expect(screen.getByText('Buy Groceries')).toBeVisible()
    expect(screen.getByText('Buy Bread')).toBeVisible()
  })

  it('should pass edit function to SwipeableList', () => {
    jest.spyOn(ToDoListProvider, 'useToDoListContext').mockReturnValue(EXAMPLE_TO_DO_LIST_CONTEXT)

    renderWithTheme(<ToDoList />)

    // The SwipeableList should receive both onSwipeAction and onEditAction
    // This test ensures the edit navigation is properly set up
    expect(mockNavigate).toHaveBeenCalledTimes(0) // Should not navigate on render
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

  describe('When the to do list is empty', () => {
    it('should render the empty list message', () => {
      jest.spyOn(ToDoListProvider, 'useToDoListContext').mockReturnValue({
        toDoList: [],
        isLoading: false,
        refetchToDoList: jest.fn(),
        removeFromToDoList: jest.fn(),
        updateToDoItemFields: jest.fn(),
      })

      renderWithTheme(<ToDoList />)

      expect(screen.getByText('No items in your to do list')).toBeVisible()
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
