import { createContext, useReducer } from 'react'
import { StateComponentProps, State, Context, Action, Actions } from './types'

export { Actions } from './types'

export const initialState: State = {
  groceryList: [],
}

export const AppState = createContext<Context>({
  state: initialState,
  dispatch: () => null,
})

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case Actions.SET_GROCERY_LIST:
      return { ...state, groceryList: action.payload }
    default:
      return state
  }
}

export const StateComponent = ({ children }: StateComponentProps) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <AppState.Provider value={{ state, dispatch }}>
      {children}
    </AppState.Provider>
  )
}

export default StateComponent
