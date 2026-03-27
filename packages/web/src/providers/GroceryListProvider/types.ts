import { ReactNode } from 'react'
import { IGroceryItem } from '../AppStateProvider/types'
import { GroceryItemUpdateFields } from '../../api/groceryList'
import { GroceryViewMode } from '../../enums/groceryCategory'

export interface IGroceryListProviderProps {
    children: ReactNode
    shopId?: string
}

export interface IState {
    groceryList: Array<IGroceryItem>
    isLoading: boolean
    isError: boolean
    isAllItemsView: boolean
    viewMode: GroceryViewMode
    refetchGroceryList: () => Promise<void>
    removeGroceryItem: (id: string) => Promise<void>
    updateGroceryItem: (id: string, quantity: number) => Promise<void>
    updateGroceryItemFields: (id: string, fields: GroceryItemUpdateFields) => Promise<void>
    setViewMode: (mode: GroceryViewMode) => void
    removeCachedItems: (ids: string[]) => void
    addItemToCache: (item: IGroceryItem) => void
}
