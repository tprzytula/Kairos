import { createContext, useContext, useCallback, useMemo } from 'react'
import { IOfficeAttendance } from '../../types/officeAttendance'
import {
  getOfficeAttendance,
  addOfficeAttendance as addOfficeAttendanceApi,
  deleteOfficeAttendance,
} from '../../api/officeAttendance'
import { IState, IOfficeAttendanceProviderProps } from './types'
import { useEntityCrud } from '../../hooks/useEntityCrud'

const initialState: IState = {
  officeAttendance: [],
  isLoading: false,
  isError: false,
  fetchOfficeAttendance: async () => {},
  addAttendance: async () => {},
  removeAttendance: async () => {},
}

export const OfficeAttendanceContext = createContext<IState>(initialState)

export const useOfficeAttendanceContext = () => useContext(OfficeAttendanceContext)

export const OfficeAttendanceProvider = ({ children }: IOfficeAttendanceProviderProps) => {
  const {
    items: officeAttendance,
    isLoading,
    isError,
    currentProject,
    refetch,
    addToCache,
    remove,
  } = useEntityCrud<IOfficeAttendance>({
    queryKeyPrefix: 'officeAttendance',
    fetchFn: getOfficeAttendance,
    updateFn: async () => {},
    deleteFn: deleteOfficeAttendance,
    staleTime: 5 * 60 * 1000,
  })

  const addAttendance = useCallback(
    async (date: string, userId: string, userName: string, userAvatar?: string) => {
      if (!currentProject) return

      const result = await addOfficeAttendanceApi(
        { date, userId, userName, userAvatar },
        currentProject.id,
      )
      addToCache({
        ...result,
        date,
        userId,
        userName,
        userAvatar,
        projectId: currentProject.id,
        createdBy: userId,
        createdAt: new Date().toISOString(),
      })
    },
    [currentProject, addToCache],
  )

  const value = useMemo(
    () => ({
      officeAttendance,
      isLoading,
      isError,
      fetchOfficeAttendance: refetch,
      addAttendance,
      removeAttendance: remove,
    }),
    [officeAttendance, isLoading, isError, refetch, addAttendance, remove],
  )

  return (
    <OfficeAttendanceContext.Provider value={value}>
      {children}
    </OfficeAttendanceContext.Provider>
  )
}
