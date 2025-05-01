import { ReactNode } from 'react'

export enum Actions {
  SET_GROCERY_LIST = 'SET_GROCERY_LIST',
}

export type Context = {
  state: State
  dispatch: React.Dispatch<Action>
}

export type State = {
  groceryList: Array<GroceryItem>
}

export type StateComponentProps = {
  children: ReactNode
}

export type GroceryItem = {
  id: string
  name: string
  quantity: number
}

export type SetGroceryListAction = {
  type: Actions.SET_GROCERY_LIST
  payload: Array<GroceryItem>
}

export type Action = SetGroceryListAction
