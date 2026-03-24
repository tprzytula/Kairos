import { createContext, useContext, useCallback, useMemo, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { StateComponentProps } from '../AppStateProvider/types'
import { IState } from './types'
import { ITodoItem } from '../../api/toDoList/retrieve/types'
import { retrieveToDoList, updateToDoItemFields } from '../../api/toDoList'
import { useProjectContext } from '../ProjectProvider'

export const initialState: IState = {
  toDoList: [],
  isLoading: false,
  isError: false,
  refetchToDoList: async () => {},
  removeFromToDoList: () => {},
  updateToDoItemFields: async () => {},
}

export const PlannerContext = createContext<IState>(initialState)

export const usePlannerContext = () => useContext(PlannerContext)

export const PlannerProvider = ({ children }: StateComponentProps) => {
  const { currentProject } = useProjectContext()
  const queryClient = useQueryClient()
  const queryKey = ['toDoList', currentProject?.id]

  const query = useQuery({
    queryKey,
    queryFn: () => retrieveToDoList(currentProject!.id),
    enabled: !!currentProject,
  })

  useEffect(() => {
    if (query.error) {
      console.error('Failed to fetch to do list:', query.error)
    }
  }, [query.error])

  const toDoList = query.data ?? []

  const refetchToDoList = useCallback(async () => {
    await query.refetch()
  }, [query.refetch])

  const removeFromToDoList = useCallback((id: string) => {
    queryClient.setQueryData<ITodoItem[]>(queryKey, (prev = []) =>
      prev.filter((item) => item.id !== id)
    )
  }, [queryClient, currentProject?.id])

  const updateToDoItemFieldsHandler = useCallback(async (id: string, fields: any) => {
    if (!currentProject) return

    try {
      await updateToDoItemFields(id, fields, currentProject.id)
      queryClient.setQueryData<ITodoItem[]>(queryKey, (prev = []) =>
        prev.map((item) => item.id === id ? { ...item, ...fields } : item)
      )
    } catch (error) {
      console.error('Failed to update todo item:', error)
      throw error
    }
  }, [currentProject, queryClient])

  const value = useMemo(
    () => ({
      toDoList,
      isLoading: query.isLoading,
      isError: query.isError,
      refetchToDoList,
      removeFromToDoList,
      updateToDoItemFields: updateToDoItemFieldsHandler,
    }),
    [toDoList, query.isLoading, query.isError, refetchToDoList, removeFromToDoList, updateToDoItemFieldsHandler]
  )

  return (
    <PlannerContext.Provider value={value}>
      {children}
    </PlannerContext.Provider>
  )
}
