import { ApiEndpoint } from '../../../enums/apiResource'
import { createUploadUrlFetcher } from '../../index'

export const getAdventureUploadUrl = createUploadUrlFetcher(ApiEndpoint.ADVENTURES)
