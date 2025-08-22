import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { INoiseTrackingItem } from '../../api/noiseTracking'
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
  const [noiseTrackingItems, setNoiseTrackingItems] = useState<Array<INoiseTrackingItem>>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchNoiseTrackingItems = useCallback(async () => {
    if (!currentProject) {
      return
    }
    
    try {
      setIsLoading(true)
      const list = await retrieveNoiseTrackingItems(currentProject.id)
      setNoiseTrackingItems(list)
    } catch (error) {
      console.error('Failed to fetch noise tracking items:', error)
      setNoiseTrackingItems([])
    } finally {
      setIsLoading(false)
    }
  }, [currentProject])

  const refetchNoiseTrackingItems = useCallback(async () => {
    await fetchNoiseTrackingItems()
  }, [fetchNoiseTrackingItems])

  useEffect(() => {
    if (currentProject) {
      fetchNoiseTrackingItems()
    } else {
      setNoiseTrackingItems([])
    }
  }, [currentProject])

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
