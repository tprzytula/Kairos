import { IOfficeAttendance } from '../../types/officeAttendance'

export interface IState {
  officeAttendance: IOfficeAttendance[]
  isLoading: boolean
  isError: boolean
  fetchOfficeAttendance: () => Promise<void>
  addAttendance: (
    date: string,
    userId: string,
    userName: string,
    userAvatar?: string,
  ) => Promise<void>
  removeAttendance: (id: string) => Promise<void>
}

export interface IOfficeAttendanceProviderProps {
  children: React.ReactNode
}
