import { ApiEndpoint } from '../../../enums/apiResource'
import { createUploadUrlFetcher } from '../../index'

export const getShopUploadUrl = createUploadUrlFetcher(ApiEndpoint.SHOPS)
