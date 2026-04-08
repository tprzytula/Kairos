import { ApiEndpoint } from '../../../enums/apiResource'
import { createDeleteFetcher } from '../../index'

export const deleteRecipe = createDeleteFetcher(ApiEndpoint.RECIPES)
