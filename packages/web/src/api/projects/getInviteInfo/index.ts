import { API_BASE_URL } from '../../index'
import { IProjectInviteInfo } from '../../../types/project'
import { createFetchOptions } from '../../../utils/api'

export const getProjectInviteInfo = async (inviteCode: string, accessToken?: string): Promise<IProjectInviteInfo> => {
  const response = await fetch(`${API_BASE_URL}/projects/invite/${inviteCode}`, createFetchOptions({}, undefined, accessToken))

  if (response.ok) {
    return await response.json()
  }

  throw new Error('Failed to get project invite info')
}
