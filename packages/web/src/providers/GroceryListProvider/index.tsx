import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { StateComponentProps } from '../AppStateProvider/types'
import { GroceryItem } from '../AppStateProvider/types'
import { retrieveGroceryList } from '../../api/groceryList'
import { IState } from './types'
import { convertListToMap } from '../../utils/map'

export const initialState: IState = {
  groceryList: new Map(),
  refetchGroceryList: async () => {},
}

export const GroceryListContext = createContext<IState>(initialState)

export const useGroceryListContext = () => useContext(GroceryListContext)

export const GroceryListProvider = ({ children }: StateComponentProps) => {
  const [groceryList, setGroceryList] = useState<Map<string, GroceryItem>>(new Map())

  const fetchGroceryList = useCallback(async () => {
    try {
      const list = await retrieveGroceryList()
      const map = convertListToMap<string, GroceryItem>(list, 'id')
      setGroceryList(map)
    } catch (error) {
      console.error('Failed to fetch grocery list:', error)
      setGroceryList(new Map())
    }
  }, [setGroceryList])

  const refetchGroceryList = useCallback(async () => {
    await fetchGroceryList()
  }, [fetchGroceryList])

  useEffect(() => {
    fetchGroceryList()
  }, [fetchGroceryList])

  const value = useMemo(() => ({ groceryList, refetchGroceryList }), [groceryList, refetchGroceryList])

  return (
    <GroceryListContext.Provider value={value}> 
      {children}
    </GroceryListContext.Provider>
  )
}
