import { createContext, useContext, useState, useCallback, useLayoutEffect, useMemo } from 'react'
import { IShop } from '../AppStateProvider/types'
import { IShopProviderProps, IShopProviderState } from './types'
import { retrieveShops, addShop as addShopAPI, updateShop as updateShopAPI, deleteShop as deleteShopAPI, ICreateShopRequestBody, IUpdateShopRequestBody } from '../../api/shops'
import { useProjectContext } from '../ProjectProvider'

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

const CURRENT_SHOP_STORAGE_KEY = 'current-shop-id'

export const ShopProvider = ({ children }: IShopProviderProps) => {
  const { currentProject } = useProjectContext()
  const [shops, setShops] = useState<Array<IShop>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentShop, setCurrentShopState] = useState<IShop | null>(null)

  const fetchShops = useCallback(async () => {
    if (!currentProject) {
      return
    }
    
    try {
      setIsLoading(true)
      const shopList = await retrieveShops(currentProject.id)
      setShops(shopList)
      
      // Set current shop from localStorage if available and valid
      const savedShopId = localStorage.getItem(`${CURRENT_SHOP_STORAGE_KEY}-${currentProject.id}`)
      if (savedShopId) {
        const savedShop = shopList.find(shop => shop.id === savedShopId)
        if (savedShop) {
          setCurrentShopState(savedShop)
        } else {
          // Clear invalid saved shop id
          localStorage.removeItem(`${CURRENT_SHOP_STORAGE_KEY}-${currentProject.id}`)
        }
      }
      
    } catch (error) {
      console.error('Failed to fetch shops:', error)
      setShops([])
    } finally {
      setIsLoading(false)
    }
  }, [currentProject])

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
    if (!currentProject) {
      throw new Error('No current project')
    }
    
    try {
      await deleteShopAPI(shopId, currentProject.id)
      
      // Update local state
      setShops(prev => prev.filter(shop => shop.id !== shopId))
      
      // Clear current shop if it was deleted
      if (currentShop?.id === shopId) {
        setCurrentShopState(null)
        localStorage.removeItem(`${CURRENT_SHOP_STORAGE_KEY}-${currentProject.id}`)
      }
    } catch (error) {
      console.error('Failed to delete shop:', error)
      throw error
    }
  }, [currentProject, currentShop])

  const setCurrentShop = useCallback((shop: IShop | null) => {
    setCurrentShopState(shop)
    
    if (currentProject) {
      if (shop) {
        localStorage.setItem(`${CURRENT_SHOP_STORAGE_KEY}-${currentProject.id}`, shop.id)
      } else {
        localStorage.removeItem(`${CURRENT_SHOP_STORAGE_KEY}-${currentProject.id}`)
      }
    }
  }, [currentProject])

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
