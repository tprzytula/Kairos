import { IDBShop } from '../types'
import { createGetFetcher } from '../../index'

export const retrieveShops = createGetFetcher<IDBShop>('shops')
