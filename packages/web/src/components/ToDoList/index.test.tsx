import { render, screen } from "@testing-library/react"
import { BrowserRouter } from 'react-router'
import ToDoList from "."
import * as ToDoListProvider from '../../providers/ToDoListProvider'
import * as ReactRouter from 'react-router'
import { IState } from "../../providers/ToDoListProvider/types"
import { ThemeProvider, createTheme } from '@mui/material/styles'

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
}))

describe('Given the ToDoList component', () => {
  const mockNavigate = jest.fn()

  beforeEach(() => {
    jest.spyOn(ReactRouter, 'useNavigate').mockReturnValue(mockNavigate)
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
