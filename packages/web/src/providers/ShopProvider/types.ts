import { ReactNode } from 'react'
import { IShop } from '../AppStateProvider/types'
import { ICreateShopRequestBody, IUpdateShopRequestBody } from '../../api/shops/types'

export interface IShopProviderProps {
    children: ReactNode
}

export interface IShopProviderState {
    shops: Array<IShop>
    isLoading: boolean
    currentShop: IShop | null
    fetchShops: () => Promise<void>
    addShop: (shop: ICreateShopRequestBody) => Promise<string>
    updateShop: (shop: IUpdateShopRequestBody) => Promise<void>
    deleteShop: (shopId: string) => Promise<void>
    setCurrentShop: (shop: IShop | null) => void
}
