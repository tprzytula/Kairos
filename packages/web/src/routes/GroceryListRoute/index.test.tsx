import { act, render, screen, waitFor, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { AppStateProvider, initialState } from '../../providers/AppStateProvider'
import theme from '../../theme'
import { BrowserRouter, useNavigate, useParams } from 'react-router'
import GroceryListRoute from '.'
import * as API from '../../api/groceryList'
import { GroceryItemUnit } from '../../enums/groceryItem'
import { useAppState } from '../../providers/AppStateProvider'
import { ProjectProvider, useProjectContext } from '../../providers/ProjectProvider'
import { useShopContext } from '../../providers/ShopProvider'
import { IProject, ProjectRole } from '../../types/project'

jest.mock('../../providers/AppStateProvider', () => ({
  ...jest.requireActual('../../providers/AppStateProvider'),
  useAppState: jest.fn(),
}))

jest.mock('../../providers/ProjectProvider', () => ({
  ...jest.requireActual('../../providers/ProjectProvider'),
  useProjectContext: jest.fn(),
}))

jest.mock('../../providers/ShopProvider', () => ({
  useShopContext: jest.fn(),
}))

jest.mock('../../api/groceryList')
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}))

// Mock the useAuth hook for ProjectProvider
jest.mock('react-oidc-context', () => ({
  useAuth: jest.fn(() => ({
    user: { access_token: 'mock-access-token' },
    isAuthenticated: true,
    isLoading: false,
    error: null
  }))
}))

const mockUseProjectContext = useProjectContext as jest.MockedFunction<typeof useProjectContext>
const mockUseShopContext = useShopContext as jest.MockedFunction<typeof useShopContext>
const mockNavigate = jest.fn()
const mockUseNavigate = useNavigate as jest.MockedFunction<typeof useNavigate>
const mockUseParams = useParams as jest.MockedFunction<typeof useParams>

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
      fetchProjects: jest.fn(),
      createProject: jest.fn(),
      joinProject: jest.fn(),
      switchProject: jest.fn(),
      getProjectInviteInfo: jest.fn(),
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
      fetchShops: jest.fn(),
      addShop: jest.fn(),
      updateShop: jest.fn(),
      deleteShop: jest.fn(),
      setCurrentShop: jest.fn(),
    })
    
    mockNavigate.mockClear()
    mockUseNavigate.mockReturnValue(mockNavigate)
    mockUseParams.mockReturnValue({ shopId: 'test-shop-id' })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should have the correct title', async () => {
    jest.spyOn(API, 'retrieveGroceryList').mockResolvedValue([])

    await act(async () => {
      renderComponent()
    })

    expect(screen.getByText('Test Shop')).toBeVisible()
  })

  it('should retrieve the grocery list', async () => {
    const groceryListSpy = jest.spyOn(API, 'retrieveGroceryList').mockResolvedValue([])

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

    jest.spyOn(API, 'retrieveGroceryList').mockResolvedValue(mockGroceryList)

    await act(async () => {
      renderComponent()
    })

    await waitFor(() => {
      expect(screen.getByText('Milk')).toBeVisible()
      expect(screen.getByText('Bread')).toBeVisible()
    })
  })

  it('should render back to shops action button', async () => {
    jest.spyOn(API, 'retrieveGroceryList').mockResolvedValue([])

    await act(async () => {
      renderComponent()
    })

    expect(screen.getByLabelText('Navigate back to shops list')).toBeVisible()
  })

  it('should navigate to shops when back to shops button is clicked', async () => {
    jest.spyOn(API, 'retrieveGroceryList').mockResolvedValue([])

    await act(async () => {
      renderComponent()
    })

    const backButton = screen.getByLabelText('Navigate back to shops list')
    fireEvent.click(backButton)

    expect(mockNavigate).toHaveBeenCalledWith('/shops')
  })

  it('should display "All Grocery Items" title when shopId is "all"', async () => {
    const groceryListSpy = jest.spyOn(API, 'retrieveGroceryList').mockResolvedValue([])
    mockUseParams.mockReturnValue({ shopId: 'all' })

    await act(async () => {
      renderComponent()
    })

    expect(screen.getByText('All Grocery Items')).toBeInTheDocument()
    expect(groceryListSpy).toHaveBeenCalledWith('test-project-id', undefined)
  })

  describe('When the fetch fails', () => {
    it('should display an error message', async () => {
      const errorSpy = jest.spyOn(console, 'error')

      jest.spyOn(API, 'retrieveGroceryList').mockRejectedValue(new Error('Bad things happen all the time'))

      await act(async () => {
        renderComponent()
      })

      expect(errorSpy).toHaveBeenCalledWith('Failed to fetch grocery list:', new Error('Bad things happen all the time'))
    })
  })
})

const renderComponent = () => {
  jest.mocked(useAppState).mockReturnValue({
    state: {
      ...initialState,
    },
    dispatch: jest.fn(),
  })

  render(
    <ThemeProvider theme={theme}>
      <ProjectProvider>
        <AppStateProvider>
          <BrowserRouter>
            <GroceryListRoute />
          </BrowserRouter>
        </AppStateProvider>
      </ProjectProvider>
    </ThemeProvider>
  )
}
