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
}

export type StateComponentProps = {
  children: ReactNode
}

export type GroceryItem = {
  id: string
  name: string
  quantity: number
  imagePath: string
  unit: GroceryItemUnit
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
