import { ApiEndpoint } from '../../../enums/apiResource'
import { IDBShop } from '../types'
import { createGetFetcher } from '../../index'

export const retrieveShops = createGetFetcher<IDBShop>(ApiEndpoint.SHOPS)
