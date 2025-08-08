import { ReactNode } from 'react'
import { ITodoItem } from '../../api/toDoList/retrieve/types'
import { ToDoItemUpdateFields } from '../../api/toDoList/update/updateSingle'

export interface IGroceryListProviderProps {
    children: ReactNode
}

export interface IState {
    toDoList: Array<ITodoItem>
    isLoading: boolean
    refetchToDoList: () => Promise<void>
    removeFromToDoList: (id: string) => void
    updateToDoItemFields: (id: string, fields: ToDoItemUpdateFields) => Promise<void>
}
