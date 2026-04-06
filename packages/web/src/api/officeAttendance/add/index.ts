import { IOfficeAttendance } from '../../../types/officeAttendance'
import { API_BASE_URL } from '../../index'
import { createFetchOptions } from '../../../utils/api'

export const addOfficeAttendance = async (
  attendance: { date: string; userId: string; userName: string; userAvatar?: string },
  projectId?: string,
): Promise<IOfficeAttendance> => {
  const response = await fetch(
    `${API_BASE_URL}/office-attendance`,
    createFetchOptions(
      {
        method: 'PUT',
        body: JSON.stringify(attendance),
      },
      projectId,
    ),
  )

  if (response.ok) {
    const data = await response.json()

    if (data.id) {
      return data
    }

    throw new Error('Unexpected response from API')
  }

  throw new Error('Failed to add office attendance')
}
