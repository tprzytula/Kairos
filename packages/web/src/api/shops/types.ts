import { IShop } from '@kairos/shared'

export type IDBShop = IShop

export interface ICreateShopRequestBody {
  name: string
  icon?: string
}

export interface IUpdateShopRequestBody {
  id: string
  name?: string
  icon?: string
  isPrivate?: boolean
}

export interface IRetrieveShopsResponse extends Array<IDBShop> {}

export interface IAddShopResponse {
  id: string
}

export interface IUpdateShopResponse {}
