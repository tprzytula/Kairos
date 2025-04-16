import { createContext, useReducer, useContext } from 'react'
import { StateComponentProps, State, Context } from './types'
import { reducer } from './reducer'

export const initialState: State = {}

export const AppState = createContext<Context>({
  state: initialState,
  dispatch: () => null,
})

export const useAppState = () => useContext(AppState)

export const AppStateProvider = ({ children }: StateComponentProps) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <AppState.Provider value={{ state, dispatch }}>
      {children}
    </AppState.Provider>
  )
}
