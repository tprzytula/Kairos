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

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch to do list:', new Error('It is what it is'))
      })
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

  it('should handle removing items from the todo list', async () => {
    jest.spyOn(API, 'retrieveToDoList').mockResolvedValue(EXAMPLE_TODO_LIST)

    const { result } = await waitFor(() => renderHook(() => useToDoListContext(), {
      wrapper: ToDoListProvider,
    }))

    await waitFor(() => {
      expect(result.current.toDoList).toHaveLength(2)
    })

    await act(async () => {
      await result.current.removeFromToDoList('1')
    })

    expect(result.current.toDoList).toHaveLength(1)
    expect(result.current.toDoList[0].id).toBe('2')
  })



  it('should handle updating todo item fields', async () => {
    jest.spyOn(API, 'retrieveToDoList').mockResolvedValue(EXAMPLE_TODO_LIST)
    jest.spyOn(API, 'updateToDoItemFields').mockResolvedValue()

    const { result } = await waitFor(() => renderHook(() => useToDoListContext(), {
      wrapper: ToDoListProvider,
    }))

    await waitFor(() => {
      expect(result.current.toDoList).toHaveLength(2)
    })

    await act(async () => {
      await result.current.updateToDoItemFields('1', { isDone: true, name: 'Updated task' })
    })

    expect(API.updateToDoItemFields).toHaveBeenCalledWith('1', { isDone: true, name: 'Updated task' })
    
    const updatedItem = result.current.toDoList.find(item => item.id === '1')
    expect(updatedItem?.isDone).toBe(true)
    expect(updatedItem?.name).toBe('Updated task')
  })

  it('should handle errors when updating todo item fields fails', async () => {
    jest.spyOn(API, 'retrieveToDoList').mockResolvedValue(EXAMPLE_TODO_LIST)
    jest.spyOn(API, 'updateToDoItemFields').mockRejectedValue(new Error('Update failed'))
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

    const { result } = await waitFor(() => renderHook(() => useToDoListContext(), {
      wrapper: ToDoListProvider,
    }))

    await waitFor(() => {
      expect(result.current.toDoList).toHaveLength(2)
    })

    await expect(async () => {
      await act(async () => {
        await result.current.updateToDoItemFields('1', { isDone: true })
      })
    }).rejects.toThrow('Update failed')

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to update todo item:', expect.any(Error))
    consoleErrorSpy.mockRestore()
  })

  it('should show loading state during API requests', async () => {
    let resolvePromise: any
    const promise = new Promise<ITodoItem[]>((resolve) => {
      resolvePromise = resolve
    })
    
    jest.spyOn(API, 'retrieveToDoList').mockReturnValue(promise)

    const { result } = renderHook(() => useToDoListContext(), {
      wrapper: ToDoListProvider,
    })

    // Should be loading initially
    expect(result.current.isLoading).toBe(true)

    // Resolve the promise
    await act(async () => {
      resolvePromise(EXAMPLE_TODO_LIST)
      await promise
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
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