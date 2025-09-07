import { createContext, useContext, useState, useCallback, useEffect, useLayoutEffect, useMemo } from 'react'
import { IGroceryItem } from '../AppStateProvider/types'
import { removeGroceryItems, retrieveGroceryList, updateGroceryItem, updateGroceryItemFields, GroceryItemUpdateFields } from '../../api/groceryList'
import { IState, IGroceryListProviderProps } from './types'
import { addPropertyToEachItemInList } from '../../utils/list'
import { GroceryViewMode } from '../../enums/groceryCategory'
import { useProjectContext } from '../ProjectProvider'

export const initialState: IState = {
  groceryList: [],
  isLoading: false,
  viewMode: GroceryViewMode.CATEGORIZED,
  refetchGroceryList: async () => {},
  removeGroceryItem: async (id: string) => {},
  updateGroceryItem: async (id: string, quantity: number) => {},
  updateGroceryItemFields: async (id: string, fields: GroceryItemUpdateFields) => {},
  setViewMode: (mode: GroceryViewMode) => {},
}

export const GroceryListContext = createContext<IState>(initialState)

export const useGroceryListContext = () => useContext(GroceryListContext)

const GROCERY_VIEW_MODE_STORAGE_KEY = 'grocery-view-mode'

export const GroceryListProvider = ({ children, shopId }: IGroceryListProviderProps) => {
  const { currentProject } = useProjectContext()
  const [groceryList, setGroceryList] = useState<Array<IGroceryItem>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<GroceryViewMode>(() => {
    const saved = localStorage.getItem(GROCERY_VIEW_MODE_STORAGE_KEY) as GroceryViewMode | null
    if (saved === GroceryViewMode.ALPHABETICAL || saved === GroceryViewMode.CATEGORIZED) {
      return saved
    }
    return GroceryViewMode.CATEGORIZED
  })

  const fetchGroceryList = useCallback(async () => {
    if (!currentProject) {
      return
    }
    
    try {
      setIsLoading(true)


      const groceryList = addPropertyToEachItemInList({
        list: await retrieveGroceryList(currentProject.id, shopId),
        properties: { toBeRemoved: false },
      })

      const mappedGroceryList = groceryList.map((item) => ({
        ...item,
        quantity: Number(item.quantity),
      }))

      setGroceryList(mappedGroceryList)
    } catch (error) {
      console.error('Failed to fetch grocery list:', error)
      setGroceryList([])
    } finally {
      setIsLoading(false)
    }
  }, [currentProject, shopId])

  const refetchGroceryList = useCallback(async () => {
    await fetchGroceryList()
  }, [fetchGroceryList])

  const removeGroceryItem = useCallback(async (id: string) => {
    if (!currentProject) return
    
    try {
      await removeGroceryItems([id], currentProject.id)
      setGroceryList((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      console.error('Failed to remove grocery item:', error)
    }
  }, [currentProject])

  const updateGroceryItemQuantity = useCallback(async (id: string, quantity: number) => {
    if (!currentProject) return
    
    try {
      await updateGroceryItem(id, quantity, currentProject.id)
      setGroceryList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      )
    } catch (error) {
      console.error('Failed to update grocery item:', error)
    }
  }, [currentProject])

  const updateGroceryItemWithFields = useCallback(async (id: string, fields: GroceryItemUpdateFields) => {
    if (!currentProject) return
    
    try {
      await updateGroceryItemFields(id, fields, currentProject.id)
      setGroceryList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, ...fields } : item
        )
      )
    } catch (error) {
      console.error('Failed to update grocery item fields:', error)
    }
  }, [currentProject])

  const handleSetViewMode = useCallback((mode: GroceryViewMode) => {
    setViewMode(mode)
    localStorage.setItem(GROCERY_VIEW_MODE_STORAGE_KEY, mode)
  }, [])

  useLayoutEffect(() => {
    if (currentProject) {
      fetchGroceryList()
    } else {
      setGroceryList([])
    }
  }, [currentProject, fetchGroceryList])

  const value = useMemo(
    () => ({
      groceryList,
      isLoading,
      viewMode,
      refetchGroceryList,
      removeGroceryItem,
      updateGroceryItem: updateGroceryItemQuantity,
      updateGroceryItemFields: updateGroceryItemWithFields,
      setViewMode: handleSetViewMode,
    }),
    [groceryList, isLoading, viewMode, refetchGroceryList, removeGroceryItem, updateGroceryItemQuantity, updateGroceryItemWithFields, handleSetViewMode]
  )

  return (
    <GroceryListContext.Provider value={value}> 
      {children}
    </GroceryListContext.Provider>
  )
}
