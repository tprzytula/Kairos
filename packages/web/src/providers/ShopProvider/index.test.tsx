import { renderHook, act, waitFor } from '@testing-library/react'
import { ReactNode } from 'react'
import { ShopProvider, useShopContext } from './index'
import { retrieveShops, addShop, updateShop, deleteShop } from '../../api/shops'
import { retrieveGroceryList } from '../../api/groceryList/retrieve'
import { getUserPreferences, updateUserPreferences } from '../../api/userPreferences'
import { useAuth } from 'react-oidc-context'
import { useProjectContext } from '../ProjectProvider'
import { useLocation } from 'react-router'
import { IShop } from '../AppStateProvider/types'
import { IProject } from '../../types/project'

jest.mock('../../api/shops', () => ({
  retrieveShops: jest.fn(),
  addShop: jest.fn(),
  updateShop: jest.fn(),
  deleteShop: jest.fn(),
}))

jest.mock('../../api/groceryList/retrieve', () => ({
  retrieveGroceryList: jest.fn(),
}))

jest.mock('../../api/userPreferences', () => ({
  getUserPreferences: jest.fn(),
  updateUserPreferences: jest.fn(),
}))

jest.mock('react-oidc-context', () => ({
  useAuth: jest.fn(),
}))

jest.mock('../ProjectProvider', () => ({
  useProjectContext: jest.fn(),
}))

jest.mock('react-router', () => ({
  useLocation: jest.fn(),
}))

const mockRetrieveShops = retrieveShops as jest.Mock
const mockAddShop = addShop as jest.Mock
const mockUpdateShop = updateShop as jest.Mock
const mockDeleteShop = deleteShop as jest.Mock
const mockRetrieveGroceryList = retrieveGroceryList as jest.Mock
const mockGetUserPreferences = getUserPreferences as jest.Mock
const mockUpdateUserPreferences = updateUserPreferences as jest.Mock
const mockUseAuth = useAuth as jest.Mock
const mockUseProjectContext = useProjectContext as jest.Mock
const mockUseLocation = useLocation as jest.Mock

const MOCK_PROJECT: IProject = {
  id: 'project-1',
  ownerId: 'user-1',
  name: 'Test Project',
  isPersonal: true,
  maxMembers: 5,
  inviteCode: 'invite-abc',
  createdAt: '2024-01-01T00:00:00Z',
}

const MOCK_SHOP: IShop = {
  id: 'shop-1',
  name: 'Test Shop',
  projectId: 'project-1',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

const Wrapper = ({ children }: { children: ReactNode }) => (
  <ShopProvider>{children}</ShopProvider>
)

describe('Given the ShopProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockUseAuth.mockReturnValue({
      user: { access_token: 'test-access-token' },
    })

    mockUseProjectContext.mockReturnValue({
      currentProject: MOCK_PROJECT,
    })

    mockUseLocation.mockReturnValue({ pathname: '/home' })

    mockRetrieveShops.mockResolvedValue([MOCK_SHOP])
    mockRetrieveGroceryList.mockResolvedValue([])
    mockGetUserPreferences.mockResolvedValue({ currentShopId: undefined, currentProjectId: 'project-1' })
    mockUpdateUserPreferences.mockResolvedValue(undefined)
    mockAddShop.mockResolvedValue({ id: 'shop-new' })
    mockUpdateShop.mockResolvedValue(undefined)
    mockDeleteShop.mockResolvedValue(undefined)
  })

  describe('When the provider mounts with a project and authenticated user', () => {
    it('should fetch shops on mount', async () => {
      renderHook(() => useShopContext(), { wrapper: Wrapper })

      await waitFor(() => {
        expect(mockRetrieveShops).toHaveBeenCalledWith('project-1')
      })
    })

    it('should set isLoading to true during the fetch', async () => {
      let resolveShops!: (value: IShop[]) => void
      mockRetrieveShops.mockReturnValue(new Promise<IShop[]>(resolve => { resolveShops = resolve }))

      const { result } = renderHook(() => useShopContext(), { wrapper: Wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true)
      })

      act(() => {
        resolveShops([MOCK_SHOP])
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })

    it('should populate shops with item counts after fetch', async () => {
      mockRetrieveGroceryList.mockResolvedValue([{ id: 'item-1' }, { id: 'item-2' }])

      const { result } = renderHook(() => useShopContext(), { wrapper: Wrapper })

      await waitFor(() => {
        expect(result.current.shops).toHaveLength(1)
      })

      expect(result.current.shops[0].id).toBe('shop-1')
      expect(result.current.shops[0].itemCount).toBe(2)
    })

    it('should set currentShop from userPreferences when the shop exists in the list', async () => {
      mockGetUserPreferences.mockResolvedValue({
        currentShopId: 'shop-1',
        currentProjectId: 'project-1',
      })

      const { result } = renderHook(() => useShopContext(), { wrapper: Wrapper })

      await waitFor(() => {
        expect(result.current.currentShop).not.toBeNull()
      })

      expect(result.current.currentShop!.id).toBe('shop-1')
    })
  })

  describe('When there is no current project', () => {
    it('should not fetch shops', () => {
      mockUseProjectContext.mockReturnValue({ currentProject: null })

      renderHook(() => useShopContext(), { wrapper: Wrapper })

      expect(mockRetrieveShops).not.toHaveBeenCalled()
    })
  })

  describe('When addShop is called', () => {
    it('should call the API and return the new shop id', async () => {
      const { result } = renderHook(() => useShopContext(), { wrapper: Wrapper })

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      let returnedId!: string
      await act(async () => {
        returnedId = await result.current.addShop({ name: 'New Shop' })
      })

      expect(mockAddShop).toHaveBeenCalledWith({ name: 'New Shop' }, 'project-1')
      expect(returnedId).toBe('shop-new')
    })

    it('should throw when there is no current project', async () => {
      mockUseProjectContext.mockReturnValue({ currentProject: null })

      const { result } = renderHook(() => useShopContext(), { wrapper: Wrapper })

      await expect(
        act(async () => {
          await result.current.addShop({ name: 'New Shop' })
        })
      ).rejects.toThrow('No current project')
    })
  })

  describe('When updateShop is called', () => {
    it('should update the shop in local state', async () => {
      const { result } = renderHook(() => useShopContext(), { wrapper: Wrapper })

      await waitFor(() => expect(result.current.shops).toHaveLength(1))

      await act(async () => {
        await result.current.updateShop({ id: 'shop-1', name: 'Updated Shop' })
      })

      expect(mockUpdateShop).toHaveBeenCalledWith({ id: 'shop-1', name: 'Updated Shop' }, 'project-1')

      await waitFor(() => {
        const updated = result.current.shops.find(s => s.id === 'shop-1')
        expect(updated!.name).toBe('Updated Shop')
      })
    })
  })

  describe('When deleteShop is called', () => {
    it('should remove the shop from state', async () => {
      const { result } = renderHook(() => useShopContext(), { wrapper: Wrapper })

      await waitFor(() => expect(result.current.shops).toHaveLength(1))

      await act(async () => {
        await result.current.deleteShop('shop-1')
      })

      expect(mockDeleteShop).toHaveBeenCalledWith('shop-1', 'project-1')

      await waitFor(() => {
        expect(result.current.shops).toHaveLength(0)
      })
    })

    it('should clear currentShop if the deleted shop was selected', async () => {
      mockGetUserPreferences.mockResolvedValue({
        currentShopId: 'shop-1',
        currentProjectId: 'project-1',
      })

      const { result } = renderHook(() => useShopContext(), { wrapper: Wrapper })

      await waitFor(() => expect(result.current.currentShop?.id).toBe('shop-1'))

      await act(async () => {
        await result.current.deleteShop('shop-1')
      })

      await waitFor(() => {
        expect(result.current.currentShop).toBeNull()
      })
    })
  })

  describe('When the fetch fails', () => {
    it('should log an error and set shops to an empty array', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      mockRetrieveShops.mockRejectedValue(new Error('Network error'))

      const { result } = renderHook(() => useShopContext(), { wrapper: Wrapper })

      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch shops:', expect.any(Error))
      expect(result.current.shops).toEqual([])

      consoleErrorSpy.mockRestore()
    })
  })
})
