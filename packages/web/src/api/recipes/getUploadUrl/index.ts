import { ApiEndpoint } from '../../../enums/apiResource'
import { createUploadUrlFetcher } from '../../index'

export const getRecipeUploadUrl = createUploadUrlFetcher(ApiEndpoint.RECIPES)
