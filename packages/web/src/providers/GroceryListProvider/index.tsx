import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { StateComponentProps } from '../AppStateProvider/types'
import { GroceryItem } from '../AppStateProvider/types'
import { retrieveGroceryList } from '../../api'
import { IState } from './types'

export const initialState: IState = {
  groceryList: [],
}

export const GroceryListContext = createContext<IState>(initialState)

export const useGroceryListContext = () => useContext(GroceryListContext)

export const GroceryListProvider = ({ children }: StateComponentProps) => {
  const [groceryList, setGroceryList] = useState<Array<GroceryItem>>([])

  const fetchGroceryList = useCallback(async () => {
    try {
      const list = await retrieveGroceryList()
      setGroceryList(list)
    } catch (error) {
      console.error('Failed to fetch grocery list:', error)
      setGroceryList([])
    }
  }, [setGroceryList])

  useEffect(() => {
    fetchGroceryList()
  }, [fetchGroceryList])

  const value = useMemo(() => ({ groceryList }), [groceryList])

  return (
    <GroceryListContext.Provider value={value}> 
      {children}
    </GroceryListContext.Provider>
  )
}
