import { useCallback, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useProjectContext } from '../../providers/ProjectProvider'

interface UseEntityCrudConfig<T extends { id: string }, F extends object = Record<string, unknown>> {
  queryKey: string
  fetchFn: (projectId: string) => Promise<T[]>
  updateFn: (id: string, fields: F, projectId: string) => Promise<void>
  deleteFn: (id: string, projectId: string) => Promise<void>
  staleTime?: number
}

export const useEntityCrud = <T extends { id: string }, F extends object = Record<string, unknown>>(config: UseEntityCrudConfig<T, F>) => {
  const { queryKey: key, fetchFn, updateFn, deleteFn, staleTime } = config
  const { currentProject } = useProjectContext()
  const queryClient = useQueryClient()
  const queryKey = [key, currentProject?.id]

  const query = useQuery({
    queryKey,
    queryFn: () => fetchFn(currentProject!.id),
    enabled: !!currentProject,
    staleTime,
  })

  useEffect(() => {
    if (query.error) {
      console.error(`Failed to fetch ${key}:`, query.error)
    }
  }, [query.error])

  const items = query.data ?? []

  const refetch = useCallback(async () => {
    await query.refetch()
  }, [query.refetch])

  const addToCache = useCallback((item: T) => {
    queryClient.setQueryData<T[]>(queryKey, (prev = []) => [...prev, item])
  }, [currentProject, queryClient])

  const update = useCallback(async (id: string, fields: F) => {
    if (!currentProject) return

    await updateFn(id, fields, currentProject.id)
    const definedFields = Object.fromEntries(
      Object.entries(fields as Record<string, unknown>).filter(([, v]) => v !== undefined)
    ) as Partial<T>
    queryClient.setQueryData<T[]>(queryKey, (prev = []) =>
      prev.map((item) => item.id === id ? { ...item, ...definedFields } : item)
    )
  }, [currentProject, queryClient])

  const remove = useCallback(async (id: string) => {
    if (!currentProject) return

    await deleteFn(id, currentProject.id)
    queryClient.setQueryData<T[]>(queryKey, (prev = []) =>
      prev.filter((item) => item.id !== id)
    )
  }, [currentProject, queryClient])

  return {
    items,
    isLoading: query.isPending,
    isError: query.isError,
    currentProject,
    refetch,
    addToCache,
    update,
    remove,
  }
}
