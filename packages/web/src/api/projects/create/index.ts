import { API_BASE_URL } from '../../index'
import { IProject, ICreateProjectRequest } from '../../../types/project'
import { createFetchOptions } from '../../../utils/api'

export const createProject = async (request: ICreateProjectRequest, accessToken?: string): Promise<IProject> => {
  const response = await fetch(`${API_BASE_URL}/projects`, createFetchOptions({
    method: 'POST',
    body: JSON.stringify(request),
  }, undefined, accessToken))

  if (response.ok) {
    return await response.json()
  }

  throw new Error('Failed to create project')
}
