import { MockedFunction } from 'vitest'
import { render, screen, renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useGroceryListContext } from './index'
import { GroceryListProvider } from './index'
import * as API from '../../api/groceryList'
import { IGroceryItem } from '../AppStateProvider/types'
import { GroceryItemUnit } from '../../enums/groceryItem'
import { useProjectContext } from '../ProjectProvider'
import { IProject } from '../../types/project'

vi.mock('../../api/groceryList')
vi.mock('../ProjectProvider', async () => ({
  ...(await vi.importActual('../ProjectProvider')),
  useProjectContext: vi.fn(),
}))

const mockUseProjectContext = useProjectContext as MockedFunction<typeof useProjectContext>

const MOCK_PROJECT: IProject = {
  id: 'test-project-id',
  ownerId: 'test-user-id',
  name: 'Test Project',
  isPersonal: false,
  maxMembers: 10,
  inviteCode: 'test-invite',
  createdAt: new Date().toISOString(),
}

const createTestQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } })

describe('Given the GroceryListProvider component', () => {
  beforeEach(() => {
    mockUseProjectContext.mockReturnValue({
      projects: [MOCK_PROJECT],
      currentProject: MOCK_PROJECT,
      isLoading: false,
      fetchProjects: vi.fn(),
      createProject: vi.fn(),
      joinProject: vi.fn(),
      switchProject: vi.fn(),
      getProjectInviteInfo: vi.fn(),
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should render the component', async () => {
    await act(async () => {
      renderGroceryListProvider()
    })

    expect(screen.getByText('Test')).toBeVisible()
  })

  it('should make a request to the API', async () => {
    vi.spyOn(API, 'retrieveGroceryList').mockResolvedValue(EXAMPLE_GROCERY_LIST)

    await act(async () => {
      renderGroceryListProvider()
    })

    await waitFor(() => expect(API.retrieveGroceryList).toHaveBeenCalledWith('test-project-id', undefined))
  })

  describe('When shopId is "all"', () => {
    it('should call retrieveGroceryList with undefined shopId to get all items', async () => {
      vi.spyOn(API, 'retrieveGroceryList').mockResolvedValue([])

      await act(async () => {
        renderGroceryListProvider({ shopId: 'all' })
      })

      await waitFor(() => {
        expect(API.retrieveGroceryList).toHaveBeenCalledWith('test-project-id', undefined)
      })
    })
  })

  describe('When the API request fails', () => {
    it('should log an error', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error')
      vi.spyOn(API, 'retrieveGroceryList').mockRejectedValue(new Error('It is what it is'))

      await act(async () => {
        renderGroceryListProvider()
      })

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch grocery list:', new Error('It is what it is'))
      })
    })
  })
})

describe('Given the useGroceryListContext hook', () => {
  beforeEach(() => {
    mockUseProjectContext.mockReturnValue({
      projects: [MOCK_PROJECT],
      currentProject: MOCK_PROJECT,
      isLoading: false,
      fetchProjects: vi.fn(),
      createProject: vi.fn(),
      joinProject: vi.fn(),
      switchProject: vi.fn(),
      getProjectInviteInfo: vi.fn(),
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return the grocery list', async () => {
    vi.spyOn(API, 'retrieveGroceryList').mockResolvedValue(EXAMPLE_GROCERY_LIST)

    const queryClient = createTestQueryClient()
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <GroceryListProvider>{children}</GroceryListProvider>
      </QueryClientProvider>
    )

    const { result } = await waitFor(() => renderHook(() => useGroceryListContext(), {
      wrapper: Wrapper,
    }))

    await waitFor(() => {
      expect(result.current.groceryList).toStrictEqual(EXAMPLE_GROCERY_LIST)
    })
  })

  it('should allow you to refetch the grocery list', async () => {
    vi.spyOn(API, 'retrieveGroceryList').mockResolvedValue(EXAMPLE_GROCERY_LIST)

    const queryClient = createTestQueryClient()
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <GroceryListProvider>{children}</GroceryListProvider>
      </QueryClientProvider>
    )

    const { result } = await waitFor(() => renderHook(() => useGroceryListContext(), {
      wrapper: Wrapper,
    }))

    await waitFor(() => {
      expect(result.current.groceryList).toStrictEqual(EXAMPLE_GROCERY_LIST)
    })

    vi.spyOn(API, 'retrieveGroceryList').mockResolvedValue([
      {
        id: '1',
        name: 'Something Else',
        quantity: 5,
        imagePath: 'https://hostname.com/image.png',
        unit: GroceryItemUnit.LITER,
        shopId: 'test-shop-1',
      },
    ])

    await act(async () => {
      await result.current.refetchGroceryList()
    })

    await waitFor(() => {
      expect(result.current.groceryList).toStrictEqual([
        {
          id: '1',
          name: 'Something Else',
          quantity: 5,
          imagePath: 'https://hostname.com/image.png',
          unit: GroceryItemUnit.LITER,
          toBeRemoved: false,
          shopId: 'test-shop-1',
        },
      ])
    })
  })

  describe('When the API request fails', () => {
    it('should return an empty array', async () => {
      vi.spyOn(API, 'retrieveGroceryList').mockRejectedValue(new Error('It is what it is'))

      const queryClient = createTestQueryClient()
      const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          <GroceryListProvider>{children}</GroceryListProvider>
        </QueryClientProvider>
      )

      const { result } = await waitFor(() => renderHook(() => useGroceryListContext(), {
        wrapper: Wrapper,
      }))

      await waitFor(() => {
        expect(result.current.groceryList).toStrictEqual([])
      })
    })
  })

  it('should allow you to update a grocery item quantity', async () => {
    vi.spyOn(API, 'retrieveGroceryList').mockResolvedValue(EXAMPLE_GROCERY_LIST)
    vi.spyOn(API, 'updateGroceryItem').mockResolvedValue()

    const queryClient = createTestQueryClient()
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <GroceryListProvider>{children}</GroceryListProvider>
      </QueryClientProvider>
    )

    const { result } = await waitFor(() => renderHook(() => useGroceryListContext(), {
      wrapper: Wrapper,
    }))

    await waitFor(() => {
      expect(result.current.groceryList).toStrictEqual(EXAMPLE_GROCERY_LIST)
    })

    await act(async () => {
      await result.current.updateGroceryItem('1', 10)
    })

    expect(API.updateGroceryItem).toHaveBeenCalledWith('1', 10, 'test-project-id')

    await waitFor(() => {
      expect(result.current.groceryList).toStrictEqual([
        {
          id: '1',
          name: 'Milk',
          quantity: 10,
          imagePath: 'https://hostname.com/image.png',
          unit: GroceryItemUnit.LITER,
          toBeRemoved: false,
          shopId: 'test-shop-1',
        },
        {
          id: '2',
          name: 'Bread',
          quantity: 2,
          imagePath: 'https://hostname.com/image.png',
          unit: GroceryItemUnit.UNIT,
          toBeRemoved: false,
          shopId: 'test-shop-1',
        },
      ])
    })
  })

  it('should allow you to update a grocery item with multiple fields', async () => {
    vi.spyOn(API, 'retrieveGroceryList').mockResolvedValue(EXAMPLE_GROCERY_LIST)
    vi.spyOn(API, 'updateGroceryItemFields').mockResolvedValue()

    const queryClient = createTestQueryClient()
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <GroceryListProvider>{children}</GroceryListProvider>
      </QueryClientProvider>
    )

    const { result } = await waitFor(() => renderHook(() => useGroceryListContext(), {
      wrapper: Wrapper,
    }))

    await waitFor(() => {
      expect(result.current.groceryList).toStrictEqual(EXAMPLE_GROCERY_LIST)
    })

    await act(async () => {
      await result.current.updateGroceryItemFields('1', {
        name: 'Organic Milk',
        quantity: 3,
        unit: GroceryItemUnit.UNIT
      })
    })

    expect(API.updateGroceryItemFields).toHaveBeenCalledWith('1', {
      name: 'Organic Milk',
      quantity: 3,
      unit: GroceryItemUnit.UNIT
    }, 'test-project-id')

    await waitFor(() => {
      expect(result.current.groceryList).toStrictEqual([
        {
          id: '1',
          name: 'Organic Milk',
          quantity: 3,
          imagePath: 'https://hostname.com/image.png',
          unit: GroceryItemUnit.UNIT,
          toBeRemoved: false,
          shopId: 'test-shop-1',
        },
        {
          id: '2',
          name: 'Bread',
          quantity: 2,
          imagePath: 'https://hostname.com/image.png',
          unit: GroceryItemUnit.UNIT,
          toBeRemoved: false,
          shopId: 'test-shop-1',
        },
      ])
    })
  })

  it('should handle removeGroceryItem', async () => {
    vi.spyOn(API, 'retrieveGroceryList').mockResolvedValue(EXAMPLE_GROCERY_LIST)
    vi.spyOn(API, 'removeGroceryItems').mockResolvedValue()

    const queryClient = createTestQueryClient()
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <GroceryListProvider>{children}</GroceryListProvider>
      </QueryClientProvider>
    )

    const { result } = await waitFor(() => renderHook(() => useGroceryListContext(), {
      wrapper: Wrapper,
    }))

    await waitFor(() => {
      expect(result.current.groceryList).toHaveLength(2)
    })

    await act(async () => {
      await result.current.removeGroceryItem('1')
    })

    expect(API.removeGroceryItems).toHaveBeenCalledWith(['1'], 'test-project-id')
    await waitFor(() => {
      expect(result.current.groceryList).toHaveLength(1)
      expect(result.current.groceryList[0].id).toBe('2')
    })
  })

  it('should handle error when removeGroceryItem fails', async () => {
    vi.spyOn(API, 'retrieveGroceryList').mockResolvedValue(EXAMPLE_GROCERY_LIST)
    vi.spyOn(API, 'removeGroceryItems').mockRejectedValue(new Error('Remove failed'))
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation()

    const queryClient = createTestQueryClient()
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <GroceryListProvider>{children}</GroceryListProvider>
      </QueryClientProvider>
    )

    const { result } = await waitFor(() => renderHook(() => useGroceryListContext(), {
      wrapper: Wrapper,
    }))

    await waitFor(() => {
      expect(result.current.groceryList).toHaveLength(2)
    })

    await act(async () => {
      await result.current.removeGroceryItem('1')
    })

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to remove grocery item:', expect.any(Error))
    consoleErrorSpy.mockRestore()
  })

  it('should handle error when updateGroceryItem fails', async () => {
    vi.spyOn(API, 'retrieveGroceryList').mockResolvedValue(EXAMPLE_GROCERY_LIST)
    vi.spyOn(API, 'updateGroceryItem').mockRejectedValue(new Error('Update failed'))
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation()

    const queryClient = createTestQueryClient()
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <GroceryListProvider>{children}</GroceryListProvider>
      </QueryClientProvider>
    )

    const { result } = await waitFor(() => renderHook(() => useGroceryListContext(), {
      wrapper: Wrapper,
    }))

    await waitFor(() => {
      expect(result.current.groceryList).toHaveLength(2)
    })

    await act(async () => {
      await result.current.updateGroceryItem('1', 5)
    })

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to update grocery item:', expect.any(Error))
    consoleErrorSpy.mockRestore()
  })

  it('should handle error when updateGroceryItemFields fails', async () => {
    vi.spyOn(API, 'retrieveGroceryList').mockResolvedValue(EXAMPLE_GROCERY_LIST)
    vi.spyOn(API, 'updateGroceryItemFields').mockRejectedValue(new Error('Update fields failed'))
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation()

    const queryClient = createTestQueryClient()
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <GroceryListProvider>{children}</GroceryListProvider>
      </QueryClientProvider>
    )

    const { result } = await waitFor(() => renderHook(() => useGroceryListContext(), {
      wrapper: Wrapper,
    }))

    await waitFor(() => {
      expect(result.current.groceryList).toHaveLength(2)
    })

    await act(async () => {
      await result.current.updateGroceryItemFields('1', { name: 'Updated Item' })
    })

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to update grocery item fields:', expect.any(Error))
    consoleErrorSpy.mockRestore()
  })
})

const EXAMPLE_GROCERY_LIST: Array<IGroceryItem> = [
  {
      id: '1',
      name: 'Milk',
      quantity: 5,
      imagePath: 'https://hostname.com/image.png',
      unit: GroceryItemUnit.LITER,
      toBeRemoved: false,
      shopId: 'test-shop-1',
    },
    {
      id: '2',
      name: 'Bread',
      quantity: 2,
      imagePath: 'https://hostname.com/image.png',
      unit: GroceryItemUnit.UNIT,
      toBeRemoved: false,
      shopId: 'test-shop-1',
  },
]

const renderGroceryListProvider = (props: { shopId?: string } = {}) => {
  const queryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <GroceryListProvider shopId={props.shopId}>
        <div>Test</div>
      </GroceryListProvider>
    </QueryClientProvider>
  )
}
