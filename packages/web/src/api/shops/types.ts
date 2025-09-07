export interface IDBShop {
  id: string
  projectId: string
  name: string
  icon?: string
  createdAt: string
  updatedAt: string
}

export interface ICreateShopRequestBody {
  name: string
  icon?: string
}

export interface IUpdateShopRequestBody {
  id: string
  name?: string
  icon?: string
}

export interface IRetrieveShopsResponse extends Array<IDBShop> {}

export interface IAddShopResponse {
  id: string
}

export interface IUpdateShopResponse {
  // Update shop returns no content, just success status
}
