import { IRecipeIngredient } from '../../../types/recipe'
import { createUpdateFetcher } from '../../index'

const updateFetcher = createUpdateFetcher('recipes', 'recipe')

export const updateRecipe = async (
  id: string,
  fields: { name?: string; ingredients?: IRecipeIngredient[]; instructions?: string[]; imagePath?: string; externalLink?: string; mealTypes?: string[]; dishTypes?: string[]; isPrivate?: boolean },
  projectId?: string
): Promise<void> => {
  return updateFetcher(id, fields, projectId)
}
