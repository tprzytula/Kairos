import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { IShop } from '../AppStateProvider/types'
import { IShopProviderProps, IShopProviderState } from './types'
import { retrieveShops, addShop as addShopAPI, updateShop as updateShopAPI, deleteShop as deleteShopAPI, ICreateShopRequestBody, IUpdateShopRequestBody } from '../../api/shops'
import { retrieveGroceryList } from '../../api/groceryList/retrieve'
import { getUserPreferences, updateUserPreferences } from '../../api/userPreferences'
import { IDBGroceryItem } from '../../api/groceryList/retrieve/types'
import { useProjectContext } from '../ProjectProvider'
import { useAuth } from 'react-oidc-context'
import { useLocation } from 'react-router'

export const initialState: IShopProviderState = {
  shops: [],
  isLoading: false,
  isError: false,
  currentShop: null,
  fetchShops: async () => {},
  addShop: async (_shop: ICreateShopRequestBody, _isPrivate?: boolean) => '',
  updateShop: async (_shop: IUpdateShopRequestBody) => {},
  deleteShop: async (_shopId: string) => {},
  setCurrentShop: (_shop: IShop | null) => {},
}

export const ShopContext = createContext<IShopProviderState>(initialState)

export const useShopContext = () => useContext(ShopContext)

export const ShopProvider = ({ children }: IShopProviderProps) => {
  const { currentProject } = useProjectContext()
  const auth = useAuth()
  const location = useLocation()
  const queryClient = useQueryClient()
  const [currentShop, setCurrentShopState] = useState<IShop | null>(null)

  const queryKey = ['shops', currentProject?.id, auth.user?.access_token]

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const [shopList, userPreferences] = await Promise.all([
        retrieveShops(currentProject!.id),
        getUserPreferences(auth.user!.access_token),
      ])

      return { shops: shopList, userPreferences }
    },
    enabled: !!currentProject && !!auth.user?.access_token,
  })

  const itemCountsQuery = useQuery({
    queryKey: ['shop-item-counts', currentProject?.id, query.data?.shops?.map(s => s.id).join(',')],
    queryFn: async (): Promise<Record<string, number>> => {
      const shopIds = query.data?.shops?.map(s => s.id) ?? []
      if (shopIds.length === 0) return {}

      const results = await Promise.all(
        shopIds.map(async (shopId): Promise<[string, IDBGroceryItem[]]> => {
          try {
            const items = await retrieveGroceryList(currentProject!.id, shopId)
            return [shopId, items]
          } catch {
            return [shopId, []]
          }
        })
      )

      return Object.fromEntries(results.map(([id, items]) => [id, items.length]))
    },
    enabled: !!currentProject && !!query.data?.shops && query.data.shops.length > 0,
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    if (query.error) {
      console.error('Failed to fetch shops:', query.error)
    }
  }, [query.error])

  // Derive currentShop when query data changes
  useEffect(() => {
    if (!query.data) return

    const { shops: shopList, userPreferences } = query.data

    setCurrentShopState((prev) => {
      if (prev) {
        const stillValidShop = shopList.find((shop) => shop.id === prev.id)
        if (stillValidShop) return stillValidShop
      }

      if (userPreferences.currentShopId) {
        const savedShop = shopList.find((shop) => shop.id === userPreferences.currentShopId)
        if (savedShop) return savedShop

        // Clear invalid saved shop id from database
        if (auth.user?.access_token) {
          updateUserPreferences({
            currentProjectId: userPreferences.currentProjectId,
            currentShopId: undefined,
          }, auth.user.access_token).catch((error) => {
            console.error('Failed to clear invalid shop preference:', error)
          })
        }
      }

      return null
    })
  }, [query.data, auth.user?.access_token])

  // Refetch when navigating to relevant pages
  useEffect(() => {
    if (currentProject && auth?.user?.access_token) {
      const pathname = location.pathname
      if (pathname === '/shops' || pathname.startsWith('/groceries/')) {
        query.refetch()
        itemCountsQuery.refetch()
      }
    }
  }, [location.pathname, currentProject, auth?.user?.access_token])

  const itemCounts = itemCountsQuery.data
  const shops = useMemo(() => {
    const baseShops = query.data?.shops ?? []
    if (!itemCounts) return baseShops
    return baseShops.map(shop => ({
      ...shop,
      itemCount: itemCounts[shop.id] ?? 0,
    }))
  }, [query.data?.shops, itemCounts])

  const fetchShops = useCallback(async () => {
    await query.refetch()
  }, [query.refetch])

  const addShop = useCallback(async (shop: ICreateShopRequestBody, isPrivate?: boolean): Promise<string> => {
    if (!currentProject) throw new Error('No current project')

    try {
      const response = await addShopAPI(shop, currentProject.id, isPrivate)
      const now = new Date().toISOString()
      const newShop: IShop = {
        id: response.id,
        projectId: currentProject.id,
        name: shop.name,
        icon: shop.icon,
        createdAt: now,
        updatedAt: now,
        itemCount: 0,
      }
      queryClient.setQueryData<{ shops: IShop[]; userPreferences: any }>(queryKey, (prev) => {
        if (!prev) return prev
        return { ...prev, shops: [...prev.shops, newShop] }
      })
      return response.id
    } catch (error) {
      console.error('Failed to add shop:', error)
      throw error
    }
  }, [currentProject, queryClient, currentProject?.id, auth.user?.access_token])

  const updateShop = useCallback(async (shop: IUpdateShopRequestBody) => {
    if (!currentProject) throw new Error('No current project')

    try {
      await updateShopAPI(shop, currentProject.id)

      queryClient.setQueryData<{ shops: IShop[]; userPreferences: any }>(queryKey, (prev) => {
        if (!prev) return prev
        return {
          ...prev,
          shops: prev.shops.map((s) =>
            s.id === shop.id ? { ...s, ...shop, updatedAt: new Date().toISOString() } : s
          ),
        }
      })

      if (currentShop?.id === shop.id) {
        setCurrentShopState((prev) => prev ? { ...prev, ...shop, updatedAt: new Date().toISOString() } : null)
      }
    } catch (error) {
      console.error('Failed to update shop:', error)
      throw error
    }
  }, [currentProject, currentShop, queryClient, currentProject?.id, auth.user?.access_token])

  const deleteShop = useCallback(async (shopId: string) => {
    if (!currentProject || !auth?.user?.access_token) {
      throw new Error('No current project or user not authenticated')
    }

    try {
      await deleteShopAPI(shopId, currentProject.id)

      queryClient.setQueryData<{ shops: IShop[]; userPreferences: any }>(queryKey, (prev) => {
        if (!prev) return prev
        return { ...prev, shops: prev.shops.filter((shop) => shop.id !== shopId) }
      })

      if (currentShop?.id === shopId) {
        setCurrentShopState(null)

        try {
          const userPreferences = await getUserPreferences(auth.user!.access_token)
          await updateUserPreferences({
            currentProjectId: userPreferences.currentProjectId,
            currentShopId: undefined,
          }, auth.user!.access_token)
        } catch (error) {
          console.error('Failed to clear current shop preference:', error)
        }
      }
    } catch (error) {
      console.error('Failed to delete shop:', error)
      throw error
    }
  }, [currentProject, currentShop, auth?.user?.access_token, queryClient, currentProject?.id])

  const setCurrentShop = useCallback(async (shop: IShop | null) => {
    let shopToSet: IShop | null = null

    if (shop) {
      const foundShop = shops.find((s) => s.id === shop.id)
      if (foundShop) {
        shopToSet = foundShop
      } else {
        shopToSet = { ...shop, projectId: shop.projectId || currentProject?.id || '' }
      }
    }

    setCurrentShopState(shopToSet)

    if (currentProject && auth?.user?.access_token) {
      try {
        const userPreferences = await getUserPreferences(auth.user.access_token)
        await updateUserPreferences({
          currentProjectId: userPreferences.currentProjectId,
          currentShopId: shopToSet?.id || undefined,
        }, auth.user.access_token)
      } catch (error) {
        console.error('Failed to update current shop preference:', error)
      }
    }
  }, [currentProject, auth?.user?.access_token, shops])

  const value = useMemo(() => ({
    shops,
    isLoading: query.isPending,
    isError: query.isError,
    currentShop,
    fetchShops,
    addShop,
    updateShop,
    deleteShop,
    setCurrentShop,
  }), [shops, query.isPending, query.isError, currentShop, fetchShops, addShop, updateShop, deleteShop, setCurrentShop])

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  )
}
