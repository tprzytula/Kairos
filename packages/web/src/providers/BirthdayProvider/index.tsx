import { createContext, useContext, useState, useCallback, useLayoutEffect, useMemo } from 'react'
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
  addBirthdayItem: (item: Omit<IBirthdayItem, 'id'>) => Promise<void>
  updateBirthdayItem: (id: string, fields: BirthdayUpdateFields) => Promise<void>
  removeBirthdayItem: (id: string) => Promise<void>
  refetchBirthdays: () => Promise<void>
}

const initialState: IBirthdayContext = {
  birthdays: [],
  isLoading: false,
  addBirthdayItem: async () => {},
  updateBirthdayItem: async () => {},
  removeBirthdayItem: async () => {},
  refetchBirthdays: async () => {},
}

export const BirthdayContext = createContext<IBirthdayContext>(initialState)

export const useBirthdayContext = () => useContext(BirthdayContext)

export const BirthdayProvider = ({ children }: StateComponentProps) => {
  const { currentProject } = useProjectContext()
  const [birthdays, setBirthdays] = useState<Array<IBirthdayItem>>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchBirthdays = useCallback(async () => {
    if (!currentProject) return

    try {
      setIsLoading(true)
      const items = await retrieveBirthdays(currentProject.id)
      setBirthdays(items)
    } catch (error) {
      console.error('Failed to fetch birthdays:', error)
      setBirthdays([])
    } finally {
      setIsLoading(false)
    }
  }, [currentProject])

  const addBirthdayItem = useCallback(async (item: Omit<IBirthdayItem, 'id'>) => {
    if (!currentProject) return

    const { id } = await addBirthday(item, currentProject.id)
    setBirthdays(prev => [...prev, { ...item, id }])
  }, [currentProject])

  const updateBirthdayItem = useCallback(async (id: string, fields: BirthdayUpdateFields) => {
    if (!currentProject) return

    await updateBirthday(id, fields, currentProject.id)
    setBirthdays(prev => prev.map(b => b.id === id ? { ...b, ...fields } : b))
  }, [currentProject])

  const removeBirthdayItem = useCallback(async (id: string) => {
    if (!currentProject) return

    await removeBirthday(id, currentProject.id)
    setBirthdays(prev => prev.filter(b => b.id !== id))
  }, [currentProject])

  const refetchBirthdays = useCallback(async () => {
    await fetchBirthdays()
  }, [fetchBirthdays])

  useLayoutEffect(() => {
    if (currentProject) {
      fetchBirthdays()
    } else {
      setBirthdays([])
    }
  }, [currentProject, fetchBirthdays])

  const value = useMemo(() => ({
    birthdays,
    isLoading,
    addBirthdayItem,
    updateBirthdayItem,
    removeBirthdayItem,
    refetchBirthdays,
  }), [birthdays, isLoading, addBirthdayItem, updateBirthdayItem, removeBirthdayItem, refetchBirthdays])

  return (
    <BirthdayContext.Provider value={value}>
      {children}
    </BirthdayContext.Provider>
  )
}
