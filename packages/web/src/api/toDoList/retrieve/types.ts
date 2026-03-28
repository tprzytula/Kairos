
export interface IStep {
  id: string
  name: string
  isDone: boolean
}

export interface ITodoItem {
  id: string
  name: string
  description?: string
  isDone: boolean
  dueDate?: number
  steps?: IStep[]
  visibility?: "private"
  ownerId?: string
}
