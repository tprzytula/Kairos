import { API_BASE_URL } from '../../index'
import { IJoinProjectRequest } from '../../../types/project'
import { createFetchOptions } from '../../../utils/api'

export const joinProject = async (request: IJoinProjectRequest, accessToken?: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/projects/join`, createFetchOptions({
    method: 'POST',
    body: JSON.stringify(request),
  }, undefined, accessToken))

  if (!response.ok) {
    throw new Error('Failed to join project')
  }
}
