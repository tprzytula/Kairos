import { render, screen } from "@testing-library/react"
import ToDoList from "."
import * as ToDoListProvider from '../../providers/ToDoListProvider'
import { IState } from "../../providers/ToDoListProvider/types"
import { ThemeProvider, createTheme } from '@mui/material/styles'

describe('Given the ToDoList component', () => {
  it('should render the to do list', () => {
    jest.spyOn(ToDoListProvider, 'useToDoListContext').mockReturnValue(EXAMPLE_TO_DO_LIST_CONTEXT)

    renderWithTheme(<ToDoList />)

    expect(screen.getByText('Buy Groceries')).toBeVisible()
    expect(screen.getByText('Buy Bread')).toBeVisible()
  })

  describe('When the to do list is empty', () => {
    it('should render the empty list message', () => {
      jest.spyOn(ToDoListProvider, 'useToDoListContext').mockReturnValue({
        toDoList: [],
        isLoading: false,
        refetchToDoList: jest.fn(),
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
      {component}
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
  ],
  isLoading: false,
  refetchToDoList: jest.fn(),
}
