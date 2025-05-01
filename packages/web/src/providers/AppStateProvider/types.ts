import { ReactNode } from 'react'

export type Context = {
  state: State
  dispatch: React.Dispatch<Action>
}

export type State = {
  
}

export type StateComponentProps = {
  children: ReactNode
}

export type GroceryItem = {
  id: string
  name: string
  quantity: number
}

export type Action = {
  type: string
  payload: any
}
