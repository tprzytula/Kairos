import { ApiEndpoint } from '../../../enums/apiResource'
import { createUploadUrlFetcher } from '../../index'

export const getGroceryDefaultUploadUrl = createUploadUrlFetcher(ApiEndpoint.GROCERY_ITEM_DEFAULTS)
