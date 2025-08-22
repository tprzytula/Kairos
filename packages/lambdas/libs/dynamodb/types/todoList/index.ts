export interface ITodoItem {
    id: string
    projectId: string
    name: string
    description?: string
    dueDate?: number
    isDone: boolean
}
