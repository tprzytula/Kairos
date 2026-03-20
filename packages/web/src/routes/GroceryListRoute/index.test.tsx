import { Mock, MockedFunction } from 'vitest'
import { act, render, screen, waitFor, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppStateProvider, initialState } from '../../providers/AppStateProvider'
import theme from '../../theme'
import { BrowserRouter, useNavigate, useParams } from 'react-router'

const createTestQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } })
import GroceryListRoute from '.'
import * as API from '../../api/groceryList'
import { GroceryItemUnit } from '../../enums/groceryItem'
import { useAppState } from '../../providers/AppStateProvider'
import { ProjectProvider, useProjectContext } from '../../providers/ProjectProvider'
import { useShopContext } from '../../providers/ShopProvider'
import { IProject, ProjectRole } from '../../types/project'

vi.mock('../../providers/AppStateProvider', async () => ({
  ...(await vi.importActual('../../providers/AppStateProvider')),
  useAppState: vi.fn(),
}))

vi.mock('../../providers/ProjectProvider', async () => ({
  ...(await vi.importActual('../../providers/ProjectProvider')),
  useProjectContext: vi.fn(),
}))

vi.mock('../../providers/ShopProvider', async () => ({
  useShopContext: vi.fn(),
}))

vi.mock('../../api/groceryList')
vi.mock('../../api/recipes')
vi.mock('react-router', async () => ({
  ...(await vi.importActual('react-router')),
  useNavigate: vi.fn(),
  useParams: vi.fn(),
}))

// Mock the useAuth hook for ProjectProvider
vi.mock('react-oidc-context', async () => ({
  useAuth: vi.fn(() => ({
    user: { access_token: 'mock-access-token' },
    isAuthenticated: true,
    isLoading: false,
    error: null
  }))
}))

const mockUseProjectContext = useProjectContext as MockedFunction<typeof useProjectContext>
const mockUseShopContext = useShopContext as MockedFunction<typeof useShopContext>
const mockNavigate = vi.fn()
const mockUseNavigate = useNavigate as MockedFunction<typeof useNavigate>
const mockUseParams = useParams as MockedFunction<typeof useParams>

const MOCK_PROJECT: IProject = {
  id: 'test-project-id',
  ownerId: 'test-user-id',
  name: 'Test Project',
  isPersonal: false,
  maxMembers: 10,
  inviteCode: 'test-invite',
  createdAt: new Date().toISOString(),
}

describe('Given the GroceryListRoute component', () => {
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

    mockUseShopContext.mockReturnValue({
      shops: [{ 
        id: 'test-shop-id', 
        name: 'Test Shop',
        projectId: 'test-project-id',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }],
      isLoading: false,
      currentShop: null,
      fetchShops: vi.fn(),
      addShop: vi.fn(),
      updateShop: vi.fn(),
      deleteShop: vi.fn(),
      setCurrentShop: vi.fn(),
    })
    
    mockNavigate.mockClear()
    mockUseNavigate.mockReturnValue(mockNavigate)
    mockUseParams.mockReturnValue({ shopId: 'test-shop-id' })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })
  it('should have the correct title', async () => {
    vi.spyOn(API, 'retrieveGroceryList').mockResolvedValue([])

    await act(async () => {
      renderComponent()
    })

    expect(screen.getByText('Test Shop')).toBeVisible()
  })

  it('should retrieve the grocery list', async () => {
    const groceryListSpy = vi.spyOn(API, 'retrieveGroceryList').mockResolvedValue([])

    await act(async () => {
      renderComponent()
    })

    expect(groceryListSpy).toHaveBeenCalledWith('test-project-id', 'test-shop-id')
  })

  it('should display the grocery list', async () => {
    const mockGroceryList = [
      { id: '1', name: 'Milk', quantity: 1, unit: GroceryItemUnit.LITER, imagePath: 'https://hostname.com/image.png', shopId: 'test-shop-1' },
      { id: '2', name: 'Bread', quantity: 2, unit: GroceryItemUnit.UNIT, imagePath: 'https://hostname.com/image.png', shopId: 'test-shop-1' },
    ]

    vi.spyOn(API, 'retrieveGroceryList').mockResolvedValue(mockGroceryList)

    await act(async () => {
      renderComponent()
    })

    await waitFor(() => {
      expect(screen.getByText('Milk')).toBeVisible()
      expect(screen.getByText('Bread')).toBeVisible()
    })
  })

  it('should render back to shops action button', async () => {
    vi.spyOn(API, 'retrieveGroceryList').mockResolvedValue([])

    await act(async () => {
      renderComponent()
    })

    expect(screen.getByLabelText('Navigate back to shops list')).toBeVisible()
  })

  it('should navigate to shops when back to shops button is clicked', async () => {
    vi.spyOn(API, 'retrieveGroceryList').mockResolvedValue([])

    await act(async () => {
      renderComponent()
    })

    const backButton = screen.getByLabelText('Navigate back to shops list')
    fireEvent.click(backButton)

    expect(mockNavigate).toHaveBeenCalledWith('/shops')
  })

  it('should display "All Grocery Items" title when shopId is "all"', async () => {
    const groceryListSpy = vi.spyOn(API, 'retrieveGroceryList').mockResolvedValue([])
    mockUseParams.mockReturnValue({ shopId: 'all' })

    await act(async () => {
      renderComponent()
    })

    expect(screen.getByText('All Grocery Items')).toBeInTheDocument()
    expect(groceryListSpy).toHaveBeenCalledWith('test-project-id', undefined)
  })

  describe('When the fetch fails', () => {
    it('should display an error message', async () => {
      const errorSpy = vi.spyOn(console, 'error')

      vi.spyOn(API, 'retrieveGroceryList').mockRejectedValue(new Error('Bad things happen all the time'))

      await act(async () => {
        renderComponent()
      })

      await waitFor(() => {
        expect(errorSpy).toHaveBeenCalledWith('Failed to fetch grocery list:', new Error('Bad things happen all the time'))
      })
    })
  })
})

const renderComponent = () => {
  vi.mocked(useAppState).mockReturnValue({
    state: {
      ...initialState,
    },
    dispatch: vi.fn(),
  })

  const queryClient = createTestQueryClient()
  render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <ProjectProvider>
          <AppStateProvider>
            <BrowserRouter>
              <GroceryListRoute />
            </BrowserRouter>
          </AppStateProvider>
        </ProjectProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
