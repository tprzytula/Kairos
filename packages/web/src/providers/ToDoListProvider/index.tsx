import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { StateComponentProps } from '../AppStateProvider/types'
import { IState } from './types'
import { ITodoItem } from '../../api/toDoList/retrieve/types'
import { retrieveToDoList } from '../../api/toDoList'

export const initialState: IState = {
  toDoList: [],
  isLoading: false,
  refetchToDoList: async () => {},
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

  const refetchToDoList = useCallback(async () => {
    await fetchToDoList()
  }, [fetchToDoList])

  useEffect(() => {
    fetchToDoList()
  }, [fetchToDoList])

  const value = useMemo(
    () => ({
      toDoList,
      isLoading,
      refetchToDoList,
    }),
    [toDoList, isLoading, refetchToDoList]
  )

  return (
    <ToDoListContext.Provider value={value}> 
      {children}
    </ToDoListContext.Provider>
  )
}
