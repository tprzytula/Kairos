import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { StateComponentProps } from '../AppStateProvider/types'
import { GroceryItem } from '../AppStateProvider/types'
import { retrieveGroceryList } from '../../api/groceryList'
import { IState } from './types'

export const initialState: IState = {
  groceryList: [],
  isLoading: false,
  refetchGroceryList: async () => {},
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

  useEffect(() => {
    fetchGroceryList()
  }, [fetchGroceryList])

  const value = useMemo(
    () => ({
      groceryList,
      isLoading,
      refetchGroceryList,
    }),
    [groceryList, isLoading, refetchGroceryList]
  )

  return (
    <GroceryListContext.Provider value={value}> 
      {children}
    </GroceryListContext.Provider>
  )
}
