import { createContext, useContext, useCallback, useMemo, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { StateComponentProps } from '../AppStateProvider/types'
import { IBirthdayItem } from '../../api/birthdays/retrieve/types'
import { retrieveBirthdays } from '../../api/birthdays/retrieve'
import { addBirthday } from '../../api/birthdays/add'
import { updateBirthday, BirthdayUpdateFields } from '../../api/birthdays/update'
import { removeBirthday } from '../../api/birthdays/remove'
import { useProjectContext } from '../ProjectProvider'

interface IBirthdayContext {
  birthdays: IBirthdayItem[]
  isLoading: boolean
  isError: boolean
  addBirthdayItem: (item: Omit<IBirthdayItem, 'id'>) => Promise<void>
  updateBirthdayItem: (id: string, fields: BirthdayUpdateFields) => Promise<void>
  removeBirthdayItem: (id: string) => Promise<void>
  refetchBirthdays: () => Promise<void>
}

const initialState: IBirthdayContext = {
  birthdays: [],
  isLoading: false,
  isError: false,
  addBirthdayItem: async () => {},
  updateBirthdayItem: async () => {},
  removeBirthdayItem: async () => {},
  refetchBirthdays: async () => {},
}

export const BirthdayContext = createContext<IBirthdayContext>(initialState)

export const useBirthdayContext = () => useContext(BirthdayContext)

export const BirthdayProvider = ({ children }: StateComponentProps) => {
  const { currentProject } = useProjectContext()
  const queryClient = useQueryClient()
  const queryKey = ['birthdays', currentProject?.id]

  const query = useQuery({
    queryKey,
    queryFn: () => retrieveBirthdays(currentProject!.id),
    enabled: !!currentProject,
  })

  useEffect(() => {
    if (query.error) {
      console.error('Failed to fetch birthdays:', query.error)
    }
  }, [query.error])

  const birthdays = query.data ?? []

  const refetchBirthdays = useCallback(async () => {
    await query.refetch()
  }, [query.refetch])

  const addBirthdayItem = useCallback(async (item: Omit<IBirthdayItem, 'id'>) => {
    if (!currentProject) return

    const { id } = await addBirthday(item, currentProject.id)
    queryClient.setQueryData<IBirthdayItem[]>(queryKey, (prev = []) => [...prev, { ...item, id }])
  }, [currentProject, queryClient])

  const updateBirthdayItem = useCallback(async (id: string, fields: BirthdayUpdateFields) => {
    if (!currentProject) return

    await updateBirthday(id, fields, currentProject.id)
    queryClient.setQueryData<IBirthdayItem[]>(queryKey, (prev = []) =>
      prev.map((b) => b.id === id ? { ...b, ...fields } : b)
    )
  }, [currentProject, queryClient])

  const removeBirthdayItem = useCallback(async (id: string) => {
    if (!currentProject) return

    await removeBirthday(id, currentProject.id)
    queryClient.setQueryData<IBirthdayItem[]>(queryKey, (prev = []) =>
      prev.filter((b) => b.id !== id)
    )
  }, [currentProject, queryClient])

  const value = useMemo(() => ({
    birthdays,
    isLoading: query.isLoading,
    isError: query.isError,
    addBirthdayItem,
    updateBirthdayItem,
    removeBirthdayItem,
    refetchBirthdays,
  }), [birthdays, query.isLoading, query.isError, addBirthdayItem, updateBirthdayItem, removeBirthdayItem, refetchBirthdays])

  return (
    <BirthdayContext.Provider value={value}>
      {children}
    </BirthdayContext.Provider>
  )
}
