import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { StateComponentProps } from '../AppStateProvider/types'
import { IState } from './types'
import { ITodoItem } from '../../api/toDoList/retrieve/types'
import { retrieveToDoList, updateToDoItemFields } from '../../api/toDoList'

export const initialState: IState = {
  toDoList: [],
  isLoading: false,
  refetchToDoList: async () => {},
  removeFromToDoList: () => {},
  updateToDoItemFields: async () => {},
}

export const ToDoListContext = createContext<IState>(initialState)

export const useToDoListContext = () => useContext(ToDoListContext)

export const ToDoListProvider = ({ children }: StateComponentProps) => {
  const [toDoList, setToDoList] = useState<Array<ITodoItem>>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchToDoList = useCallback(async () => {
    try {
      setIsLoading(true)
      const list = await retrieveToDoList()
      setToDoList(list)
    } catch (error) {
      console.error('Failed to fetch to do list:', error)
      setToDoList([])
    } finally {
      setIsLoading(false)
    }
  }, [setToDoList])

  const removeFromToDoList = useCallback(async (id: string) => {
    try {
      setToDoList((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      console.error('Failed to remove to do item:', error)
    }
  }, [toDoList])

  const refetchToDoList = useCallback(async () => {
    await fetchToDoList()
  }, [fetchToDoList])

  const updateToDoItemFieldsHandler = useCallback(async (id: string, fields: any) => {
    try {
      await updateToDoItemFields(id, fields)
      
      // Update the local state to reflect the changes
      setToDoList((prev) => 
        prev.map((item) => 
          item.id === id 
            ? { ...item, ...fields }
            : item
        )
      )
    } catch (error) {
      console.error('Failed to update todo item:', error)
      throw error
    }
  }, [])

  useEffect(() => {
    fetchToDoList()
  }, [fetchToDoList])

  const value = useMemo(
    () => ({
      toDoList,
      isLoading,
      refetchToDoList,
      removeFromToDoList,
      updateToDoItemFields: updateToDoItemFieldsHandler,
    }),
    [toDoList, isLoading, refetchToDoList, removeFromToDoList, updateToDoItemFieldsHandler]
  )

  return (
    <ToDoListContext.Provider value={value}> 
      {children}
    </ToDoListContext.Provider>
  )
}
