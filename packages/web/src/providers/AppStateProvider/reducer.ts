import { Action, Actions, State } from "./types"

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
      case Actions.SET_GROCERY_LIST:
        return { ...state, groceryList: action.payload }
      default:
        return state
  }
}
