import { IOfficeAttendance } from '../../../types/officeAttendance'
import { API_BASE_URL } from '../../index'
import { createFetchOptions } from '../../../utils/api'

export const getOfficeAttendance = async (projectId?: string): Promise<IOfficeAttendance[]> => {
  const response = await fetch(`${API_BASE_URL}/office-attendance`, createFetchOptions({}, projectId))

  if (response.ok) {
    return await response.json()
  }

  return []
}
