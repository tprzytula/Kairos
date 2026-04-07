import { ApiEndpoint } from '../../../enums/apiResource'
import { createDeleteFetcher } from '../../index'

export const deleteShop = createDeleteFetcher(ApiEndpoint.SHOPS)
