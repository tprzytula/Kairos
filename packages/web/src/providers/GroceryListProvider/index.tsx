import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { StateComponentProps } from '../AppStateProvider/types'
import { GroceryItem } from '../AppStateProvider/types'
import { removeGroceryItems, retrieveGroceryList } from '../../api/groceryList'
import { IState } from './types'

export const initialState: IState = {
  groceryList: [],
  isLoading: false,
  refetchGroceryList: async () => {},
  removeGroceryItem: async (id: string) => {},
}

export const GroceryListContext = createContext<IState>(initialState)

export const useGroceryListContext = () => useContext(GroceryListContext)

export const GroceryListProvider = ({ children }: StateComponentProps) => {
  const [groceryList, setGroceryList] = useState<Array<GroceryItem>>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchGroceryList = useCallback(async () => {
    try {
      setIsLoading(true)
      const list = await retrieveGroceryList()
      setGroceryList(list)
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

  useEffect(() => {
    fetchGroceryList()
  }, [fetchGroceryList])

  const value = useMemo(
    () => ({
      groceryList,
      isLoading,
      refetchGroceryList,
      removeGroceryItem,
    }),
    [groceryList, isLoading, refetchGroceryList, removeGroceryItem]
  )

  return (
    <GroceryListContext.Provider value={value}> 
      {children}
    </GroceryListContext.Provider>
  )
}
