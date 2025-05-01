import { ReactNode } from 'react'
import { GroceryItem } from '../AppStateProvider/types'

export interface IGroceryItem {
    id: string
    name: string
    quantity: number
}

export interface IGroceryListProviderProps {
    children: ReactNode
}

export interface IState {
    groceryList: Array<GroceryItem>
    refetchGroceryList: () => Promise<void>
}
