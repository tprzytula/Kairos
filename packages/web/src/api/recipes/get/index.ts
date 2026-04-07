import { IRecipe } from '../../../types/recipe'
import { createGetFetcher } from '../../index'

export const getRecipes = createGetFetcher<IRecipe>('recipes')
