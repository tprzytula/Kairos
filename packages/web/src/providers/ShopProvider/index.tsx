import { createContext, useContext, useState, useCallback, useLayoutEffect, useMemo } from 'react'
import { IShop } from '../AppStateProvider/types'
import { IShopProviderProps, IShopProviderState } from './types'
import { retrieveShops, addShop as addShopAPI, updateShop as updateShopAPI, deleteShop as deleteShopAPI, ICreateShopRequestBody, IUpdateShopRequestBody } from '../../api/shops'
import { retrieveGroceryList } from '../../api/groceryList/retrieve'
import { getUserPreferences, updateUserPreferences } from '../../api/userPreferences'
import { useProjectContext } from '../ProjectProvider'
import { useAuth } from 'react-oidc-context'

export const initialState: IShopProviderState = {
  shops: [],
  isLoading: false,
  currentShop: null,
  fetchShops: async () => {},
  addShop: async (shop: ICreateShopRequestBody) => '',
  updateShop: async (shop: IUpdateShopRequestBody) => {},
  deleteShop: async (shopId: string) => {},
  setCurrentShop: (shop: IShop | null) => {},
}

export const ShopContext = createContext<IShopProviderState>(initialState)

export const useShopContext = () => useContext(ShopContext)

export const ShopProvider = ({ children }: IShopProviderProps) => {
  const { currentProject } = useProjectContext()
  const auth = useAuth()
  const [shops, setShops] = useState<Array<IShop>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentShop, setCurrentShopState] = useState<IShop | null>(null)

  const fetchShops = useCallback(async () => {
    if (!currentProject || !auth?.user?.access_token) {
      return
    }
    
    try {
      setIsLoading(true)
      const [shopList, userPreferences] = await Promise.all([
        retrieveShops(currentProject.id),
        getUserPreferences(auth.user.access_token)
      ])
      
      // Fetch item counts for each shop
      const shopsWithItemCounts = await Promise.all(
        shopList.map(async (shop) => {
          try {
            const groceryItems = await retrieveGroceryList(currentProject.id, shop.id)
            return {
              ...shop,
              itemCount: groceryItems.length
            }
          } catch (error) {
            console.error(`Failed to fetch items for shop ${shop.id}:`, error)
            return {
              ...shop,
              itemCount: 0
            }
          }
        })
      )
      
      setShops(shopsWithItemCounts)
      
      // Set current shop from user preferences if available and valid
      if (userPreferences.currentShopId) {
        const savedShop = shopsWithItemCounts.find(shop => shop.id === userPreferences.currentShopId)
        if (savedShop) {
          setCurrentShopState(savedShop)
        } else {
          // Clear invalid saved shop id from database
          try {
            await updateUserPreferences({ 
              currentProjectId: userPreferences.currentProjectId,
              currentShopId: undefined 
            }, auth.user.access_token)
          } catch (error) {
            console.error('Failed to clear invalid shop preference:', error)
          }
        }
      }
      
    } catch (error) {
      console.error('Failed to fetch shops:', error)
      setShops([])
    } finally {
      setIsLoading(false)
    }
  }, [currentProject, auth?.user?.access_token])

  const addShop = useCallback(async (shop: ICreateShopRequestBody): Promise<string> => {
    if (!currentProject) {
      throw new Error('No current project')
    }
    
    try {
      const response = await addShopAPI(shop, currentProject.id)
      await fetchShops() // Refresh shop list
      return response.id
    } catch (error) {
      console.error('Failed to add shop:', error)
      throw error
    }
  }, [currentProject, fetchShops])

  const updateShop = useCallback(async (shop: IUpdateShopRequestBody) => {
    if (!currentProject) {
      throw new Error('No current project')
    }
    
    try {
      await updateShopAPI(shop, currentProject.id)
      
      // Update local state
      setShops(prev => prev.map(s => 
        s.id === shop.id ? { ...s, ...shop, updatedAt: new Date().toISOString() } : s
      ))
      
      // Update current shop if it was the one being updated
      if (currentShop?.id === shop.id) {
        setCurrentShopState(prev => prev ? { ...prev, ...shop, updatedAt: new Date().toISOString() } : null)
      }
    } catch (error) {
      console.error('Failed to update shop:', error)
      throw error
    }
  }, [currentProject, currentShop])

  const deleteShop = useCallback(async (shopId: string) => {
    if (!currentProject || !auth?.user?.access_token) {
      throw new Error('No current project or user not authenticated')
    }
    
    try {
      await deleteShopAPI(shopId, currentProject.id)
      
      // Update local state
      setShops(prev => prev.filter(shop => shop.id !== shopId))
      
      // Clear current shop if it was deleted
      if (currentShop?.id === shopId) {
        setCurrentShopState(null)
        
        try {
          // Get current user preferences to preserve currentProjectId
          const userPreferences = await getUserPreferences(auth.user!.access_token)
          
          await updateUserPreferences({
            currentProjectId: userPreferences.currentProjectId,
            currentShopId: undefined
          }, auth.user!.access_token)
        } catch (error) {
          console.error('Failed to clear current shop preference:', error)
        }
      }
    } catch (error) {
      console.error('Failed to delete shop:', error)
      throw error
    }
  }, [currentProject, currentShop, auth?.user?.access_token])

  const setCurrentShop = useCallback(async (shop: IShop | null) => {
    setCurrentShopState(shop)
    
    if (currentProject && auth?.user?.access_token) {
      try {
        // Get current user preferences to preserve currentProjectId
        const userPreferences = await getUserPreferences(auth.user.access_token)
        
        await updateUserPreferences({
          currentProjectId: userPreferences.currentProjectId,
          currentShopId: shop?.id || undefined
        }, auth.user.access_token)
      } catch (error) {
        console.error('Failed to update current shop preference:', error)
      }
    }
  }, [currentProject, auth?.user?.access_token])

  useLayoutEffect(() => {
    if (currentProject) {
      fetchShops()
    } else {
      setShops([])
      setCurrentShopState(null)
    }
  }, [currentProject, fetchShops])

  const value = useMemo(() => ({
    shops,
    isLoading,
    currentShop,
    fetchShops,
    addShop,
    updateShop,
    deleteShop,
    setCurrentShop,
  }), [shops, isLoading, currentShop, fetchShops, addShop, updateShop, deleteShop, setCurrentShop])

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  )
}
