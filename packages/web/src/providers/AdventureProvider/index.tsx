import { createContext, useContext, useCallback, useMemo } from 'react'
import { IAdventure } from '../../types/adventure'
import { getAdventures, addAdventure as addAdventureApi, updateAdventure as updateAdventureApi, deleteAdventure } from '../../api/adventures'
import { IState, IAdventureProviderProps, IAddAdventureRequest, IUpdateAdventureRequest } from './types'
import { useEntityCrud } from '../../hooks/useEntityCrud'

const initialState: IState = {
  adventures: [],
  isLoading: false,
  isError: false,
  refetchAdventures: async () => {},
  addAdventure: async () => {},
  updateAdventure: async () => {},
  removeAdventure: async () => {},
}

export const AdventureContext = createContext<IState>(initialState)

export const useAdventureContext = () => useContext(AdventureContext)

export const AdventureProvider = ({ children }: IAdventureProviderProps) => {
  const { items: adventures, isLoading, isError, currentProject, refetch, addToCache, update, remove } = useEntityCrud<IAdventure, IUpdateAdventureRequest>({
    queryKey: 'adventures',
    fetchFn: getAdventures,
    updateFn: (id, fields, projectId) => updateAdventureApi(id, fields, projectId),
    deleteFn: deleteAdventure,
  })

  const addAdventure = useCallback(async (adventure: IAddAdventureRequest) => {
    if (!currentProject) return

    const result = await addAdventureApi(adventure, currentProject.id)
    addToCache({
      ...result,
      ...adventure,
      projectId: currentProject.id,
    })
  }, [currentProject, addToCache])

  const value = useMemo(
    () => ({
      adventures,
      isLoading,
      isError,
      refetchAdventures: refetch,
      addAdventure,
      updateAdventure: update,
      removeAdventure: remove,
    }),
    [adventures, isLoading, isError, refetch, addAdventure, update, remove]
  )

  return (
    <AdventureContext.Provider value={value}>
      {children}
    </AdventureContext.Provider>
  )
}
