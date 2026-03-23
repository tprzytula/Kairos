import { createContext, useContext, useCallback, useMemo, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { IAdventure } from '../../types/adventure'
import { getAdventures, addAdventure as addAdventureApi, updateAdventure as updateAdventureApi, deleteAdventure } from '../../api/adventures'
import { IState, IAdventureProviderProps, IAddAdventureRequest, IUpdateAdventureRequest } from './types'
import { useProjectContext } from '../ProjectProvider'

const initialState: IState = {
  adventures: [],
  isLoading: false,
  refetchAdventures: async () => {},
  addAdventure: async () => {},
  updateAdventure: async () => {},
  removeAdventure: async () => {},
}

export const AdventureContext = createContext<IState>(initialState)

export const useAdventureContext = () => useContext(AdventureContext)

export const AdventureProvider = ({ children }: IAdventureProviderProps) => {
  const { currentProject } = useProjectContext()
  const queryClient = useQueryClient()
  const queryKey = ['adventures', currentProject?.id]

  const query = useQuery({
    queryKey,
    queryFn: () => getAdventures(currentProject!.id),
    enabled: !!currentProject,
  })

  useEffect(() => {
    if (query.error) {
      console.error('Failed to fetch adventures:', query.error)
    }
  }, [query.error])

  const adventures = query.data ?? []

  const refetchAdventures = useCallback(async () => {
    await query.refetch()
  }, [query.refetch])

  const addAdventure = useCallback(async (adventure: IAddAdventureRequest) => {
    if (!currentProject) return

    const result = await addAdventureApi(adventure, currentProject.id)
    const newAdventure: IAdventure = {
      ...result,
      ...adventure,
      projectId: currentProject.id,
    }
    queryClient.setQueryData<IAdventure[]>(queryKey, (prev = []) => [...prev, newAdventure])
  }, [currentProject, queryClient])

  const updateAdventure = useCallback(async (id: string, fields: IUpdateAdventureRequest) => {
    if (!currentProject) return

    await updateAdventureApi(id, fields, currentProject.id)
    const definedFields = Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v !== undefined)
    ) as Partial<IAdventure>
    queryClient.setQueryData<IAdventure[]>(queryKey, (prev = []) =>
      prev.map((adventure) => adventure.id === id ? { ...adventure, ...definedFields } : adventure)
    )
  }, [currentProject, queryClient])

  const removeAdventure = useCallback(async (id: string) => {
    if (!currentProject) return

    await deleteAdventure(id, currentProject.id)
    queryClient.setQueryData<IAdventure[]>(queryKey, (prev = []) =>
      prev.filter((adventure) => adventure.id !== id)
    )
  }, [currentProject, queryClient])

  const value = useMemo(
    () => ({
      adventures,
      isLoading: query.isLoading,
      refetchAdventures,
      addAdventure,
      updateAdventure,
      removeAdventure,
    }),
    [adventures, query.isLoading, refetchAdventures, addAdventure, updateAdventure, removeAdventure]
  )

  return (
    <AdventureContext.Provider value={value}>
      {children}
    </AdventureContext.Provider>
  )
}
