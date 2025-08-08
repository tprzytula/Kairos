import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { StateComponentProps } from '../AppStateProvider/types'
import { IGroceryItem } from '../AppStateProvider/types'
import { removeGroceryItems, retrieveGroceryList, updateGroceryItem, updateGroceryItemFields, GroceryItemUpdateFields } from '../../api/groceryList'
import { IState } from './types'
import { addPropertyToEachItemInList } from '../../utils/list'

export const initialState: IState = {
  groceryList: [],
  isLoading: false,
  refetchGroceryList: async () => {},
  removeGroceryItem: async (id: string) => {},
  updateGroceryItem: async (id: string, quantity: number) => {},
  updateGroceryItemFields: async (id: string, fields: GroceryItemUpdateFields) => {},
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

  const updateGroceryItemWithFields = useCallback(async (id: string, fields: GroceryItemUpdateFields) => {
    try {
      await updateGroceryItemFields(id, fields)
      setGroceryList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, ...fields } : item
        )
      )
    } catch (error) {
      console.error('Failed to update grocery item fields:', error)
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
      updateGroceryItemFields: updateGroceryItemWithFields,
    }),
    [groceryList, isLoading, refetchGroceryList, removeGroceryItem, updateGroceryItemQuantity, updateGroceryItemWithFields]
  )

  return (
    <GroceryListContext.Provider value={value}> 
      {children}
    </GroceryListContext.Provider>
  )
}
