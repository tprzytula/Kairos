import { ApiEndpoint } from '../../../enums/apiResource'
import { createDeleteFetcher } from '../../index'

export const deleteOfficeAttendance = createDeleteFetcher(ApiEndpoint.OFFICE_ATTENDANCE)
