import { render, screen, renderHook, waitFor, act } from '@testing-library/react'
import { useToDoListContext } from './index'
import { ToDoListProvider } from './index'
import * as API from '../../api/toDoList'
import { ITodoItem } from '../../api/toDoList/retrieve/types'

jest.mock('../../api/toDoList')

describe('Given the ToDoListProvider component', () => {
  it('should render the component', async () => {
    await act(async () => {
      renderToDoListProvider()
    })

    expect(screen.getByText('Test')).toBeVisible()
  })

  it('should make a request to the API', async () => {
    jest.spyOn(API, 'retrieveToDoList').mockResolvedValue(EXAMPLE_TODO_LIST)

    await act(async () => {
      renderToDoListProvider()
    })

    await waitFor(() => expect(API.retrieveToDoList).toHaveBeenCalled())
  })

  describe('When the API request fails', () => {
    it('should log an error', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error')
      jest.spyOn(API, 'retrieveToDoList').mockRejectedValue(new Error('It is what it is'))

      await act(async () => {
        renderToDoListProvider()
      })

      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch to do list:', new Error('It is what it is'))
    })
  })
})

describe('Given the useGroceryListContext hook', () => {
  it('should return the grocery list', async () => {
    jest.spyOn(API, 'retrieveToDoList').mockResolvedValue(EXAMPLE_TODO_LIST)

    const { result } = await waitFor(() => renderHook(() => useToDoListContext(), {
      wrapper: ToDoListProvider,
    }))

    await waitFor(() => {
      expect(result.current.toDoList).toStrictEqual(EXAMPLE_TODO_LIST)
    })
  })

  it('should allow you to refetch the grocery list', async () => {
    jest.spyOn(API, 'retrieveToDoList').mockResolvedValue(EXAMPLE_TODO_LIST)

    const { result } = await waitFor(() => renderHook(() => useToDoListContext(), {
      wrapper: ToDoListProvider,
    }))

    await waitFor(() => {
      expect(result.current.toDoList).toStrictEqual(EXAMPLE_TODO_LIST)
    })

    jest.spyOn(API, 'retrieveToDoList').mockResolvedValue([
      {
        id: '1',
        name: 'Something Else',
        description: 'Buy groceries for the week',
        isDone: false,
        dueDate: 1746042442000,
      },
    ])

    await act(async () => {
      await result.current.refetchToDoList()
    })

    await waitFor(() => {
      expect(result.current.toDoList).toStrictEqual([
        {
          id: '1',
          name: 'Something Else',
          description: 'Buy groceries for the week',
          isDone: false,
          dueDate: 1746042442000,
        },
      ])
    })
  })

  describe('When the API request fails', () => {
    it('should return an empty array', async () => {
      jest.spyOn(API, 'retrieveToDoList').mockRejectedValue(new Error('It is what it is'))

      const { result } = await waitFor(() => renderHook(() => useToDoListContext(), {
        wrapper: ToDoListProvider,
      }))

      await waitFor(() => {
        expect(result.current.toDoList).toStrictEqual([])
      })
    })
  })
})

const EXAMPLE_TODO_LIST: Array<ITodoItem> = [
  {
    id: '1',
    name: 'Buy groceries',
    description: 'Buy groceries for the week',
    isDone: false,
    dueDate: 1746042442000,
  },
  {
    id: '2',
    name: 'Buy bread',
    description: 'Buy bread for the week',
    isDone: false,
    dueDate: 1746042442000,
  },
]

const renderToDoListProvider = () => {
  return render(
    <ToDoListProvider>
      <div>Test</div>
    </ToDoListProvider>
  )
}