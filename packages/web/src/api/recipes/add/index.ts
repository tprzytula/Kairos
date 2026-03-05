import { IRecipe, IRecipeIngredient } from '../../../types/recipe'
import { API_BASE_URL } from '../../index'
import { createFetchOptions } from '../../../utils/api'

export const addRecipe = async (
  recipe: { name: string; ingredients: IRecipeIngredient[] },
  projectId?: string
): Promise<IRecipe> => {
  const response = await fetch(`${API_BASE_URL}/recipes`, createFetchOptions({
    method: 'PUT',
    body: JSON.stringify(recipe),
  }, projectId))

  if (response.ok) {
    const data = await response.json()

    if (data.id) {
      return data
    }

    throw new Error('Unexpected response from API')
  }

  throw new Error('Failed to add recipe')
}
