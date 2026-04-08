import { ApiEndpoint } from '../../../enums/apiResource'
import { IOfficeAttendance } from '../../../types/officeAttendance'
import { createGetFetcher } from '../../index'

export const getOfficeAttendance = createGetFetcher<IOfficeAttendance>(ApiEndpoint.OFFICE_ATTENDANCE)
