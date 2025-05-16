import { ReactNode } from 'react'
import { ITodoItem } from '../../api/toDoList/retrieve/types'

export interface IGroceryListProviderProps {
    children: ReactNode
}

export interface IState {
    toDoList: Array<ITodoItem>
    isLoading: boolean
    refetchToDoList: () => Promise<void>
    removeFromToDoList: (id: string) => void
}
