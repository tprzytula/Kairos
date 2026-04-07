import { IOfficeAttendance } from '../../../types/officeAttendance'
import { createGetFetcher } from '../../index'

export const getOfficeAttendance = createGetFetcher<IOfficeAttendance>('office-attendance')
