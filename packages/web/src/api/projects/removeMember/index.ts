import { API_BASE_URL } from '../../index'
import { createFetchOptions } from '../../../utils/api'

export const removeProjectMember = async (
  targetUserId: string,
  projectId: string,
  accessToken?: string
): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/projects/members/${targetUserId}`,
    createFetchOptions(
      {
        method: 'DELETE',
      },
      projectId,
      accessToken
    )
  )

  if (!response.ok) {
    throw new Error('Failed to remove project member')
  }
}
