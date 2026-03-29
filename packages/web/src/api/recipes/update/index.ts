import { IRecipeIngredient } from '../../../types/recipe'
import { API_BASE_URL } from '../../index'
import { createFetchOptions } from '../../../utils/api'

export const updateRecipe = async (
  id: string,
  fields: { name?: string; ingredients?: IRecipeIngredient[]; instructions?: string[]; imagePath?: string; externalLink?: string; mealTypes?: string[]; dishTypes?: string[]; isPrivate?: boolean },
  projectId?: string
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/recipes/${id}`, createFetchOptions({
    method: 'POST',
    body: JSON.stringify({ id, ...fields }),
  }, projectId))

  if (!response.ok) {
    throw new Error('Failed to update recipe')
  }
}
