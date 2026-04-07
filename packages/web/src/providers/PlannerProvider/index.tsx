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
  updateToDoItemsBulk: () => {},
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
    staleTime: 5 * 60 * 1000,
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

  const updateToDoItemsBulk = useCallback((ids: string[], fields: Partial<ITodoItem>) => {
    const idSet = new Set(ids)
    queryClient.setQueryData<ITodoItem[]>(queryKey, (prev = []) =>
      prev.map((item) => idSet.has(item.id) ? { ...item, ...fields } : item)
    )
  }, [queryClient, currentProject?.id])

  const value = useMemo(
    () => ({
      toDoList,
      isLoading: query.isPending,
      isError: query.isError,
      refetchToDoList,
      removeFromToDoList,
      updateToDoItemFields: updateToDoItemFieldsHandler,
      updateToDoItemsBulk,
    }),
    [toDoList, query.isPending, query.isError, refetchToDoList, removeFromToDoList, updateToDoItemFieldsHandler, updateToDoItemsBulk]
  )

  return (
    <PlannerContext.Provider value={value}>
      {children}
    </PlannerContext.Provider>
  )
}
