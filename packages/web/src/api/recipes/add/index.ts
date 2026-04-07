import { IRecipe, IRecipeIngredient } from '../../../types/recipe'
import { createAddFetcher } from '../../index'

const addFetcher = createAddFetcher<IRecipe>('recipes', 'recipe')

export const addRecipe = async (
  recipe: { name: string; ingredients: IRecipeIngredient[]; instructions?: string[]; imagePath?: string; externalLink?: string; mealTypes?: string[]; dishTypes?: string[] },
  projectId?: string,
  isPrivate?: boolean
): Promise<IRecipe> => {
  return addFetcher(recipe, projectId, isPrivate)
}
