import { IProjectMemberDetails } from '../../../types/projectMemberDetails'
import { API_BASE_URL } from '../../index'
import { createFetchOptions } from '../../../utils/api'

export const getProjectMembersDetails = async (
  projectId?: string,
): Promise<IProjectMemberDetails[]> => {
  const response = await fetch(
    `${API_BASE_URL}/projects/members`,
    createFetchOptions({}, projectId),
  )

  if (response.ok) {
    return await response.json()
  }

  return []
}
