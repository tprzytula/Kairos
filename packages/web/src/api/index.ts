import { createFetchOptions } from '../utils/api'

export const API_BASE_URL = 'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1'

export const createGetFetcher = <T>(endpoint: string) =>
  async (projectId?: string): Promise<T[]> => {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, createFetchOptions({}, projectId))

    if (response.ok) {
      return await response.json()
    }

    return []
  }

export const createAddFetcher = <T>(endpoint: string, entityName: string) =>
  async (body: Record<string, unknown>, projectId?: string, isPrivate?: boolean): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, createFetchOptions({
      method: 'PUT',
      body: JSON.stringify({
        ...body,
        ...(isPrivate && { isPrivate: true }),
      }),
    }, projectId))

    if (response.ok) {
      const data = await response.json()

      if (data.id) {
        return data
      }

      throw new Error('Unexpected response from API')
    }

    throw new Error(`Failed to add ${entityName}`)
  }

export const createUpdateFetcher = (endpoint: string, entityName: string) =>
  async (id: string, fields: Record<string, unknown>, projectId?: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, createFetchOptions({
      method: 'POST',
      body: JSON.stringify({ id, ...fields }),
    }, projectId))

    if (!response.ok) {
      throw new Error(`Failed to update ${entityName}`)
    }
  }

export const createUploadUrlFetcher = (endpoint: string) =>
  async (extension: string, projectId?: string): Promise<{ uploadUrl: string; imagePath: string }> => {
    const response = await fetch(
      `${API_BASE_URL}/${endpoint}/upload-url?extension=${encodeURIComponent(extension)}`,
      createFetchOptions({}, projectId)
    )
    if (response.ok) return await response.json()
    throw new Error('Failed to get upload URL')
  }

export const createDeleteFetcher = (endpoint: string, entityName: string) =>
  async (id: string, projectId?: string): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/${endpoint}/${id}`,
      createFetchOptions({ method: 'DELETE' }, projectId)
    )
    if (!response.ok) throw new Error(`Failed to delete ${entityName}`)
  }
