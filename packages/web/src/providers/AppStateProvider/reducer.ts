import { Action, State } from "./types"
import { ActionName } from "./enums"
import { addToMap, removeFromMap } from "../../utils/map"

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionName.SHOW_ALERT: {
      return {
        ...state,
        alerts: addToMap(state.alerts, action.payload.id, {
          id: action.payload.id,
          description: action.payload.description,
          severity: action.payload.severity,
        }),
      }
    }
    case ActionName.HIDE_ALERT: {
      return {
        ...state,
        alerts: removeFromMap(state.alerts, action.payload.id),
      }
    }
    default: {
      return state
    }
  }
}
