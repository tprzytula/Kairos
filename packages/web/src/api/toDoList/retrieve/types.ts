import { ITodoItem as ITodoItemBase } from '@kairos/shared'

export interface IStep {
  id: string
  name: string
  isDone: boolean
}

export interface ITodoItem extends Omit<ITodoItemBase, 'projectId'> {
  steps?: IStep[]
  visibility?: "private"
  ownerId?: string
}
