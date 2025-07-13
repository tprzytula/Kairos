import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { StateComponentProps } from '../AppStateProvider/types'
import { IGroceryItem } from '../AppStateProvider/types'
import { removeGroceryItems, retrieveGroceryList, updateGroceryItem } from '../../api/groceryList'
import { IState } from './types'
import { addPropertyToEachItemInList } from '../../utils/list'

export const initialState: IState = {
  groceryList: [],
  isLoading: false,
  refetchGroceryList: async () => {},
  removeGroceryItem: async (id: string) => {},
  updateGroceryItem: async (id: string, quantity: number) => {},
}

export const GroceryListContext = createContext<IState>(initialState)

export const useGroceryListContext = () => useContext(GroceryListContext)

export const GroceryListProvider = ({ children }: StateComponentProps) => {
  const [groceryList, setGroceryList] = useState<Array<IGroceryItem>>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchGroceryList = useCallback(async () => {
    try {
      setIsLoading(true)

      const groceryList = addPropertyToEachItemInList({
        list: await retrieveGroceryList(),
        properties: { toBeRemoved: false },
      })

      setGroceryList(groceryList)
    } catch (error) {
      console.error('Failed to fetch grocery list:', error)
      setGroceryList([])
    } finally {
      setIsLoading(false)
    }
  }, [setGroceryList])

  const refetchGroceryList = useCallback(async () => {
    await fetchGroceryList()
  }, [fetchGroceryList])

  const removeGroceryItem = useCallback(async (id: string) => {
    try {
      await removeGroceryItems([id])
      setGroceryList((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      console.error('Failed to remove grocery item:', error)
    }
  }, [groceryList])

  const updateGroceryItemQuantity = useCallback(async (id: string, quantity: number) => {
    try {
      await updateGroceryItem(id, quantity)
      setGroceryList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      )
    } catch (error) {
      console.error('Failed to update grocery item:', error)
    }
  }, [])

  useEffect(() => {
    fetchGroceryList()
  }, [fetchGroceryList])

  const value = useMemo(
    () => ({
      groceryList,
      isLoading,
      refetchGroceryList,
      removeGroceryItem,
      updateGroceryItem: updateGroceryItemQuantity,
    }),
    [groceryList, isLoading, refetchGroceryList, removeGroceryItem, updateGroceryItemQuantity]
  )

  return (
    <GroceryListContext.Provider value={value}> 
      {children}
    </GroceryListContext.Provider>
  )
}
