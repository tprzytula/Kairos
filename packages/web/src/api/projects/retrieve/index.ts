import { API_BASE_URL } from '../../index'
import { IProject } from '../../../types/project'
import { createFetchOptions } from '../../../utils/api'

export const retrieveUserProjects = async (accessToken?: string): Promise<IProject[]> => {
  const response = await fetch(`${API_BASE_URL}/projects`, createFetchOptions({}, undefined, accessToken))

  if (response.ok) {
    return await response.json()
  }

  throw new Error('Failed to retrieve user projects')
}
