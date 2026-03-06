import { API_BASE_URL } from '../../index'
import { createFetchOptions } from '../../../utils/api'

export const getRecipeUploadUrl = async (
  extension: string,
  projectId?: string
): Promise<{ uploadUrl: string; imagePath: string }> => {
  const response = await fetch(
    `${API_BASE_URL}/recipes/upload-url?extension=${encodeURIComponent(extension)}`,
    createFetchOptions({}, projectId)
  )

  if (response.ok) {
    return await response.json()
  }

  throw new Error('Failed to get upload URL')
}
