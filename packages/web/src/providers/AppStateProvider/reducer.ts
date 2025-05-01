import { Action, State } from "./types"
import { ActionName } from "./enums"
import { addToMap, removeFromMap } from "../../utils/map"
import { addToSet, removeFromSet } from "../../utils/set"

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
    case ActionName.PURCHASE_GROCERY_ITEM: {
      return {
        ...state,
        purchasedItems: addToSet(state.purchasedItems, action.payload.id),
      }
    }
    case ActionName.CLEAR_PURCHASED_ITEM: {
      return {
        ...state,
        purchasedItems: removeFromSet(state.purchasedItems, action.payload.id),
      }
    }
    case ActionName.CLEAR_PURCHASED_ITEMS: {
      return {
        ...state,
        purchasedItems: removeFromSet(state.purchasedItems, ...action.payload),
      }
    }
    default: {
      return state
    }
  }
}
