import { createContext, useContext, useCallback, useMemo, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { INoiseTrackingItem, retrieveNoiseTrackingItems } from '../../api/noiseTracking'
import { IState, INoiseTrackingProviderProps } from './types'
import { useProjectContext } from '../ProjectProvider'

export const initialState: IState = {
  noiseTrackingItems: [],
  isLoading: false,
  isError: false,
  refetchNoiseTrackingItems: async () => {},
  addItemToCache: (_item: INoiseTrackingItem) => {},
  removeItemFromCache: (_timestamp: number) => {},
}

export const NoiseTrackingContext = createContext<IState>(initialState)

export const useNoiseTrackingContext = () => useContext(NoiseTrackingContext)

export const NoiseTrackingProvider = ({ children }: INoiseTrackingProviderProps) => {
  const { currentProject } = useProjectContext()
  const queryClient = useQueryClient()
  const queryKey = ['noiseTrackingItems', currentProject?.id]

  const query = useQuery({
    queryKey,
    queryFn: () => retrieveNoiseTrackingItems(currentProject!.id),
    enabled: !!currentProject,
  })

  useEffect(() => {
    if (query.error) {
      console.error('Failed to fetch noise tracking items:', query.error)
    }
  }, [query.error])

  const noiseTrackingItems = query.data ?? []

  const refetchNoiseTrackingItems = useCallback(async () => {
    await query.refetch()
  }, [query.refetch])

  const addItemToCache = useCallback((item: INoiseTrackingItem) => {
    queryClient.setQueryData<INoiseTrackingItem[]>(queryKey, (prev = []) => [item, ...prev])
  }, [queryClient, currentProject?.id])

  const removeItemFromCache = useCallback((timestamp: number) => {
    queryClient.setQueryData<INoiseTrackingItem[]>(queryKey, (prev = []) =>
      prev.filter((item) => item.timestamp !== timestamp)
    )
  }, [queryClient, currentProject?.id])

  const value = useMemo(
    () => ({
      noiseTrackingItems,
      isLoading: query.isLoading,
      isError: query.isError,
      refetchNoiseTrackingItems,
      addItemToCache,
      removeItemFromCache,
    }),
    [noiseTrackingItems, query.isLoading, query.isError, refetchNoiseTrackingItems, addItemToCache, removeItemFromCache]
  )

  return (
    <NoiseTrackingContext.Provider value={value}>
      {children}
    </NoiseTrackingContext.Provider>
  )
}
