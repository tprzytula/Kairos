import { createContext, useContext, useCallback, useMemo } from 'react'
import { StateComponentProps } from '../AppStateProvider/types'
import { IBirthdayItem } from '../../api/birthdays/retrieve/types'
import { retrieveBirthdays } from '../../api/birthdays/retrieve'
import { addBirthday } from '../../api/birthdays/add'
import { updateBirthday, BirthdayUpdateFields } from '../../api/birthdays/update'
import { removeBirthday } from '../../api/birthdays/remove'
import { useEntityCrud } from '../../hooks/useEntityCrud'

interface IBirthdayContext {
  birthdays: IBirthdayItem[]
  isLoading: boolean
  isError: boolean
  addBirthdayItem: (item: Omit<IBirthdayItem, 'id'>, isPrivate?: boolean) => Promise<void>
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
  const { items: birthdays, isLoading, isError, currentProject, refetch, addToCache, update, remove } = useEntityCrud<IBirthdayItem>({
    queryKeyPrefix: 'birthdays',
    fetchFn: retrieveBirthdays,
    updateFn: (id, fields, projectId) => updateBirthday(id, fields as BirthdayUpdateFields, projectId),
    deleteFn: removeBirthday,
  })

  const addBirthdayItem = useCallback(async (item: Omit<IBirthdayItem, 'id'>, isPrivate?: boolean) => {
    if (!currentProject) return

    const { id } = await addBirthday(item, currentProject.id, isPrivate)
    addToCache({ ...item, id, ...(isPrivate && { visibility: 'private' as const }) })
  }, [currentProject, addToCache])

  const value = useMemo(() => ({
    birthdays,
    isLoading,
    isError,
    addBirthdayItem,
    updateBirthdayItem: update,
    removeBirthdayItem: remove,
    refetchBirthdays: refetch,
  }), [birthdays, isLoading, isError, addBirthdayItem, update, remove, refetch])

  return (
    <BirthdayContext.Provider value={value}>
      {children}
    </BirthdayContext.Provider>
  )
}
