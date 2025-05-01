import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { INoiseTrackingItem } from '../../api/noiseTracking'
import { retrieveNoiseTrackingItems } from '../../api/noiseTracking'
import { IState, INoiseTrackingProviderProps } from './types'

export const initialState: IState = {
  noiseTrackingItems: [],
  isLoading: false,
  refetchNoiseTrackingItems: async () => {},
}

export const NoiseTrackingContext = createContext<IState>(initialState)

export const useNoiseTrackingContext = () => useContext(NoiseTrackingContext)

export const NoiseTrackingProvider = ({ children }: INoiseTrackingProviderProps) => {
  const [noiseTrackingItems, setNoiseTrackingItems] = useState<Array<INoiseTrackingItem>>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchNoiseTrackingItems = useCallback(async () => {
    try {
      setIsLoading(true)
      const list = await retrieveNoiseTrackingItems()
      setNoiseTrackingItems(list)
    } catch (error) {
      console.error('Failed to fetch noise tracking items:', error)
      setNoiseTrackingItems([])
    } finally {
      setIsLoading(false)
    }
  }, [setNoiseTrackingItems])

  const refetchNoiseTrackingItems = useCallback(async () => {
    await fetchNoiseTrackingItems()
  }, [fetchNoiseTrackingItems])

  useEffect(() => {
    fetchNoiseTrackingItems()
  }, [fetchNoiseTrackingItems])

  const value = useMemo(
    () => ({
      noiseTrackingItems,
      isLoading,
      refetchNoiseTrackingItems,
    }),
    [noiseTrackingItems, isLoading, refetchNoiseTrackingItems]
  )

  return (
    <NoiseTrackingContext.Provider value={value}> 
      {children}
    </NoiseTrackingContext.Provider>
  )
}
