import { AlertColor } from '@mui/material'
import { ReactNode } from 'react'
import { ActionName } from './enums'
import { IAlert } from '../../components/Alert/types'
import { GroceryItemUnit } from '../../enums/groceryItem'

export type Context = {
  state: State
  dispatch: React.Dispatch<Action>
}

export type State = {
  alerts: Map<string, IAlert>
  purchasedItems: Set<string>
  selectedTodoItems: Set<string>
}

export type StateComponentProps = {
  children: ReactNode
}

export type IGroceryItem = {
  id: string
  name: string
  quantity: number
  shopId: string
  imagePath?: string
  unit: GroceryItemUnit
  category?: string
  toBeRemoved: boolean
}

export type IShop = {
  id: string
  projectId: string
  name: string
  icon?: string
  createdAt: string
  updatedAt: string
  itemCount?: number
}

export type Action = {
  type: string
  payload: any
}

export type ShowAlertAction = {
  type: ActionName.SHOW_ALERT
  payload: {
    id: string
    description: string
    severity: AlertColor
  }
}

export type HideAlertAction = {
  type: ActionName.HIDE_ALERT
  payload: {
    id: string
  }
}

export type PurchaseGroceryItemAction = {
  type: ActionName.PURCHASE_GROCERY_ITEM
  payload: {
    id: string
  }
}

export type ClearPurchasedItemAction = {
  type: ActionName.CLEAR_PURCHASED_ITEM
  payload: {
    id: string
  }
}
