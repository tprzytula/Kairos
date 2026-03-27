import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { IGroceryItem } from '../AppStateProvider/types'
import { removeGroceryItems, retrieveGroceryList, updateGroceryItem, updateGroceryItemFields, GroceryItemUpdateFields } from '../../api/groceryList'
import { IState, IGroceryListProviderProps } from './types'
import { addPropertyToEachItemInList } from '../../utils/list'
import { mergeGroceryItem } from '../../utils/grocery/mergeGroceryItem'
import { GroceryViewMode } from '../../enums/groceryCategory'
import { useProjectContext } from '../ProjectProvider'

export const initialState: IState = {
  groceryList: [],
  isLoading: false,
  isError: false,
  isAllItemsView: false,
  viewMode: GroceryViewMode.CATEGORIZED,
  refetchGroceryList: async () => {},
  removeGroceryItem: async (_id: string) => {},
  updateGroceryItem: async (_id: string, _quantity: number) => {},
  updateGroceryItemFields: async (_id: string, _fields: GroceryItemUpdateFields) => {},
  setViewMode: (_mode: GroceryViewMode) => {},
  removeCachedItems: (_ids: string[]) => {},
  addItemToCache: (_item: IGroceryItem) => {},
}

export const GroceryListContext = createContext<IState>(initialState)

export const useGroceryListContext = () => useContext(GroceryListContext)

const GROCERY_VIEW_MODE_STORAGE_KEY = 'grocery-view-mode'

export const GroceryListProvider = ({ children, shopId }: IGroceryListProviderProps) => {
  const { currentProject } = useProjectContext()
  const queryClient = useQueryClient()
  const [viewMode, setViewMode] = useState<GroceryViewMode>(() => {
    const saved = localStorage.getItem(GROCERY_VIEW_MODE_STORAGE_KEY) as GroceryViewMode | null
    if (saved === GroceryViewMode.ALPHABETICAL || saved === GroceryViewMode.CATEGORIZED) {
      return saved
    }
    return GroceryViewMode.CATEGORIZED
  })

  const actualShopId = shopId === 'all' ? undefined : shopId
  const queryKey = ['groceryList', currentProject?.id, actualShopId]

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const rawList = await retrieveGroceryList(currentProject!.id, actualShopId)
      const withProps = addPropertyToEachItemInList({
        list: rawList,
        properties: { toBeRemoved: false },
      })
      return withProps.map((item) => ({
        ...item,
        quantity: Number(item.quantity),
      }))
    },
    enabled: !!currentProject,
  })

  useEffect(() => {
    if (query.error) {
      console.error('Failed to fetch grocery list:', query.error)
    }
  }, [query.error])

  const groceryList = query.data ?? []

  const refetchGroceryList = useCallback(async () => {
    await query.refetch()
  }, [query.refetch])

  const removeGroceryItem = useCallback(async (id: string) => {
    if (!currentProject) return

    try {
      await removeGroceryItems([id], currentProject.id)
      queryClient.setQueryData<IGroceryItem[]>(queryKey, (prev = []) =>
        prev.filter((item) => item.id !== id)
      )
    } catch (error) {
      console.error('Failed to remove grocery item:', error)
    }
  }, [currentProject, queryClient, currentProject?.id, actualShopId])

  const updateGroceryItemQuantity = useCallback(async (id: string, quantity: number) => {
    if (!currentProject) return

    try {
      await updateGroceryItem(id, quantity, currentProject.id)
      queryClient.setQueryData<IGroceryItem[]>(queryKey, (prev = []) =>
        prev.map((item) => item.id === id ? { ...item, quantity } : item)
      )
    } catch (error) {
      console.error('Failed to update grocery item:', error)
    }
  }, [currentProject, queryClient, currentProject?.id, actualShopId])

  const updateGroceryItemWithFields = useCallback(async (id: string, fields: GroceryItemUpdateFields) => {
    if (!currentProject) return

    try {
      await updateGroceryItemFields(id, fields, currentProject.id)
      queryClient.setQueryData<IGroceryItem[]>(queryKey, (prev = []) =>
        prev.map((item) => item.id === id ? { ...item, ...fields } : item)
      )
    } catch (error) {
      console.error('Failed to update grocery item fields:', error)
    }
  }, [currentProject, queryClient, currentProject?.id, actualShopId])

  const removeCachedItems = useCallback((ids: string[]) => {
    const idSet = new Set(ids)
    queryClient.setQueryData<IGroceryItem[]>(queryKey, (prev = []) =>
      prev.filter((item) => !idSet.has(item.id))
    )
  }, [queryClient, currentProject?.id, actualShopId])

  const addItemToCache = useCallback((item: IGroceryItem) => {
    queryClient.setQueryData<IGroceryItem[]>(queryKey, (prev = []) => mergeGroceryItem(prev, item))
  }, [queryClient, currentProject?.id, actualShopId])

  const handleSetViewMode = useCallback((mode: GroceryViewMode) => {
    setViewMode(mode)
    localStorage.setItem(GROCERY_VIEW_MODE_STORAGE_KEY, mode)
  }, [])

  const isAllItemsView = shopId === 'all'

  const value = useMemo(
    () => ({
      groceryList,
      isLoading: query.isLoading,
      isError: query.isError,
      isAllItemsView,
      viewMode,
      refetchGroceryList,
      removeGroceryItem,
      updateGroceryItem: updateGroceryItemQuantity,
      updateGroceryItemFields: updateGroceryItemWithFields,
      setViewMode: handleSetViewMode,
      removeCachedItems,
      addItemToCache,
    }),
    [groceryList, query.isLoading, query.isError, isAllItemsView, viewMode, refetchGroceryList, removeGroceryItem, updateGroceryItemQuantity, updateGroceryItemWithFields, handleSetViewMode, removeCachedItems, addItemToCache]
  )

  return (
    <GroceryListContext.Provider value={value}>
      {children}
    </GroceryListContext.Provider>
  )
}
