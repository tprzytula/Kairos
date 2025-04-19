import { ActionName } from "../../providers/AppStateProvider/enums"
import { IAlertPayload } from "../../components/Alert/types"
import { Dispatch } from "react"
import { Action } from "../../providers/AppStateProvider/types"

export const hideAlert = (id: string, dispatch: Dispatch<Action>): void => {
  dispatch({
    type: ActionName.HIDE_ALERT,
    payload: { id },
  })
}

export const showAlert = (alert: IAlertPayload, dispatch: Dispatch<Action>): void => {
  const id = generateId()

  dispatch({
    type: ActionName.SHOW_ALERT,
    payload: {
      id,
      ...alert,
    },
  })
}

export const generateId = (): string => {
  return crypto.randomUUID()
}