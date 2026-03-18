import React from 'react'
import { render, screen, renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { usePlannerContext } from './index'
import { PlannerProvider } from './index'
import * as API from '../../api/toDoList'
import { ITodoItem } from '../../api/toDoList/retrieve/types'
import { ProjectContext } from '../ProjectProvider'
import { IProject } from '../../types/project'

jest.mock('../../api/toDoList', () => ({
  retrieveToDoList: jest.fn(),
  updateToDoItems: jest.fn(),
  updateToDoItemFields: jest.fn(),
  addTodoItem: jest.fn(),
  removeTodoItems: jest.fn(),
}))
jest.mock('react-oidc-context', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { access_token: 'mock-token' }
  })
}))
jest.mock('../../api/projects', () => ({
  retrieveUserProjects: jest.fn().mockResolvedValue([])
}))

const createTestQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } })

describe('Given the PlannerProvider component', () => {
  it('should render the component', async () => {
    await act(async () => {
      renderPlannerProvider()
    })

    expect(screen.getByText('Test')).toBeVisible()
  })

  it('should make a request to the API', async () => {
    jest.spyOn(API, 'retrieveToDoList').mockResolvedValue(EXAMPLE_TODO_LIST)

    await act(async () => {
      renderPlannerProvider()
    })

    await waitFor(() => expect(API.retrieveToDoList).toHaveBeenCalled())
  })

  describe('When the API request fails', () => {
    it('should log an error', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error')
      jest.spyOn(API, 'retrieveToDoList').mockRejectedValue(new Error('It is what it is'))

      await act(async () => {
        renderPlannerProvider()
      })

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch to do list:', new Error('It is what it is'))
      })
    })
  })
})

describe('Given the usePlannerContext hook', () => {
  it('should return the todo list', async () => {
    jest.spyOn(API, 'retrieveToDoList').mockResolvedValue(EXAMPLE_TODO_LIST)

    const queryClient = createTestQueryClient()
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <MockProjectProvider>
          <PlannerProvider>{children}</PlannerProvider>
        </MockProjectProvider>
      </QueryClientProvider>
    )

    const { result } = await waitFor(() => renderHook(() => usePlannerContext(), {
      wrapper: Wrapper,
    }))

    await waitFor(() => {
      expect(result.current.toDoList).toStrictEqual(EXAMPLE_TODO_LIST)
    })
  })

  it('should allow you to refetch the todo list', async () => {
    jest.spyOn(API, 'retrieveToDoList').mockResolvedValue(EXAMPLE_TODO_LIST)

    const queryClient = createTestQueryClient()
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <MockProjectProvider>
          <PlannerProvider>{children}</PlannerProvider>
        </MockProjectProvider>
      </QueryClientProvider>
    )

    const { result } = await waitFor(() => renderHook(() => usePlannerContext(), {
      wrapper: Wrapper,
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

      const queryClient = createTestQueryClient()
      const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          <MockProjectProvider>
            <PlannerProvider>{children}</PlannerProvider>
          </MockProjectProvider>
        </QueryClientProvider>
      )

      const { result } = await waitFor(() => renderHook(() => usePlannerContext(), {
        wrapper: Wrapper,
      }))

      await waitFor(() => {
        expect(result.current.toDoList).toStrictEqual([])
      })
    })
  })

  it('should handle removing items from the todo list', async () => {
    jest.spyOn(API, 'retrieveToDoList').mockResolvedValue(EXAMPLE_TODO_LIST)

    const queryClient = createTestQueryClient()
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <MockProjectProvider>
          <PlannerProvider>{children}</PlannerProvider>
        </MockProjectProvider>
      </QueryClientProvider>
    )

    const { result } = await waitFor(() => renderHook(() => usePlannerContext(), {
      wrapper: Wrapper,
    }))

    await waitFor(() => {
      expect(result.current.toDoList).toHaveLength(2)
    })

    await act(async () => {
      await result.current.removeFromToDoList('1')
    })

    await waitFor(() => {
      expect(result.current.toDoList).toHaveLength(1)
      expect(result.current.toDoList[0].id).toBe('2')
    })
  })



  it('should handle updating todo item fields', async () => {
    jest.spyOn(API, 'retrieveToDoList').mockResolvedValue(EXAMPLE_TODO_LIST)
    jest.spyOn(API, 'updateToDoItemFields').mockResolvedValue()

    const queryClient = createTestQueryClient()
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <MockProjectProvider>
          <PlannerProvider>{children}</PlannerProvider>
        </MockProjectProvider>
      </QueryClientProvider>
    )

    const { result } = await waitFor(() => renderHook(() => usePlannerContext(), {
      wrapper: Wrapper,
    }))

    await waitFor(() => {
      expect(result.current.toDoList).toHaveLength(2)
    })

    await act(async () => {
      await result.current.updateToDoItemFields('1', { isDone: true, name: 'Updated task' })
    })

    expect(API.updateToDoItemFields).toHaveBeenCalledWith('1', { isDone: true, name: 'Updated task' }, 'test-project-id')

    await waitFor(() => {
      const updatedItem = result.current.toDoList.find(item => item.id === '1')
      expect(updatedItem?.isDone).toBe(true)
      expect(updatedItem?.name).toBe('Updated task')
    })
  })

  it('should handle errors when updating todo item fields fails', async () => {
    jest.spyOn(API, 'retrieveToDoList').mockResolvedValue(EXAMPLE_TODO_LIST)
    jest.spyOn(API, 'updateToDoItemFields').mockRejectedValue(new Error('Update failed'))
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

    const queryClient = createTestQueryClient()
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <MockProjectProvider>
          <PlannerProvider>{children}</PlannerProvider>
        </MockProjectProvider>
      </QueryClientProvider>
    )

    const { result } = await waitFor(() => renderHook(() => usePlannerContext(), {
      wrapper: Wrapper,
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

    const queryClient = createTestQueryClient()
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <MockProjectProvider>
          <PlannerProvider>{children}</PlannerProvider>
        </MockProjectProvider>
      </QueryClientProvider>
    )

    const { result } = renderHook(() => usePlannerContext(), {
      wrapper: Wrapper,
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

const MOCK_PROJECT: IProject = {
  id: 'test-project-id',
  name: 'Test Project',
  isPersonal: true,
  ownerId: 'test-user-id',
  maxMembers: 10,
  inviteCode: 'test-invite-code',
  createdAt: new Date().toISOString()
}

const MockProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const mockValue = {
    projects: [MOCK_PROJECT],
    currentProject: MOCK_PROJECT,
    isLoading: false,
    createProject: jest.fn(),
    joinProject: jest.fn(),
    switchProject: jest.fn(),
    fetchProjects: jest.fn(),
    getProjectInviteInfo: jest.fn(),
  }

  return (
    <ProjectContext.Provider value={mockValue}>
      {children}
    </ProjectContext.Provider>
  )
}

const renderPlannerProvider = () => {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <MockProjectProvider>
        <PlannerProvider>
          <div>Test</div>
        </PlannerProvider>
      </MockProjectProvider>
    </QueryClientProvider>
  )
}
