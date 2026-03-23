import { createContext, useContext, useCallback, useMemo, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { retrieveNoiseTrackingItems } from '../../api/noiseTracking'
import { IState, INoiseTrackingProviderProps } from './types'
import { useProjectContext } from '../ProjectProvider'

export const initialState: IState = {
  noiseTrackingItems: [],
  isLoading: false,
  refetchNoiseTrackingItems: async () => {},
}

export const NoiseTrackingContext = createContext<IState>(initialState)

export const useNoiseTrackingContext = () => useContext(NoiseTrackingContext)

export const NoiseTrackingProvider = ({ children }: INoiseTrackingProviderProps) => {
  const { currentProject } = useProjectContext()

  const query = useQuery({
    queryKey: ['noiseTrackingItems', currentProject?.id],
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

  const value = useMemo(
    () => ({
      noiseTrackingItems,
      isLoading: query.isLoading,
      refetchNoiseTrackingItems,
    }),
    [noiseTrackingItems, query.isLoading, refetchNoiseTrackingItems]
  )

  return (
    <NoiseTrackingContext.Provider value={value}>
      {children}
    </NoiseTrackingContext.Provider>
  )
}
