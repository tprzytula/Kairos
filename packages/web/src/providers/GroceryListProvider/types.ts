import { ReactNode } from 'react'
import { IGroceryItem } from '../../api/groceryList/retrieve/types'

export interface IGroceryListProviderProps {
    children: ReactNode
}

export interface IState {
    groceryList: Array<IGroceryItem>
    isLoading: boolean
    refetchGroceryList: () => Promise<void>
    removeGroceryItem: (id: string) => Promise<void>
}
