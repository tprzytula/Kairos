import { IRecipe } from '../../../types/recipe'
import { API_BASE_URL } from '../../index'
import { createFetchOptions } from '../../../utils/api'

export const getRecipes = async (projectId?: string): Promise<IRecipe[]> => {
  const response = await fetch(`${API_BASE_URL}/recipes`, createFetchOptions({}, projectId))

  if (response.ok) {
    return await response.json()
  }

  return []
}
