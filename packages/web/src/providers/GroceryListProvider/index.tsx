import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { StateComponentProps } from '../AppStateProvider/types'
import { GroceryItem } from '../AppStateProvider/types'
import { retrieveGroceryList } from '../../api/groceryList'
import { IState } from './types'
import { useAppState } from '../AppStateProvider'
import { ActionName } from '../AppStateProvider/enums'

export const initialState: IState = {
  groceryList: [],
  refetchGroceryList: async () => {},
}

export const GroceryListContext = createContext<IState>(initialState)

export const useGroceryListContext = () => useContext(GroceryListContext)

export const GroceryListProvider = ({ children }: StateComponentProps) => {
  const [groceryList, setGroceryList] = useState<Array<GroceryItem>>([])
  const { state: { purchasedItems }, dispatch } = useAppState()

  const fetchGroceryList = useCallback(async () => {
    try {
      const list = await retrieveGroceryList()
      setGroceryList(list)
    } catch (error) {
      console.error('Failed to fetch grocery list:', error)
      setGroceryList([])
    }
  }, [setGroceryList])

  const refetchGroceryList = useCallback(async () => {
    await fetchGroceryList()
  }, [fetchGroceryList])

  const clearRemovedItemsFromPurchasedItems = useCallback(() => {
    const mismatchedItems = Array.from(purchasedItems).filter(
      purchasedItemId => !groceryList.some(({ id }) => id === purchasedItemId)
    )
    
    if (mismatchedItems.length) {
      dispatch({ 
        type: ActionName.CLEAR_PURCHASED_ITEMS, 
        payload: mismatchedItems 
      })
    }
  }, [purchasedItems, groceryList, dispatch])

  useEffect(() => {
    fetchGroceryList()
  }, [fetchGroceryList])

  useEffect(() => {
    clearRemovedItemsFromPurchasedItems()
  }, [clearRemovedItemsFromPurchasedItems])

  const value = useMemo(() => ({ groceryList, refetchGroceryList }), [groceryList, refetchGroceryList])

  return (
    <GroceryListContext.Provider value={value}> 
      {children}
    </GroceryListContext.Provider>
  )
}
