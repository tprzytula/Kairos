import { IPrivateItemFields } from "../visibility";

export interface ITodoItem extends IPrivateItemFields {
    id: string
    projectId: string
    name: string
    description?: string
    dueDate?: number
    isDone: boolean
}
