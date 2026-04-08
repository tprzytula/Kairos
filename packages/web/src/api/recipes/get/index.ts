import { ApiEndpoint } from '../../../enums/apiResource'
import { IRecipe } from '../../../types/recipe'
import { createGetFetcher } from '../../index'

export const getRecipes = createGetFetcher<IRecipe>(ApiEndpoint.RECIPES)
