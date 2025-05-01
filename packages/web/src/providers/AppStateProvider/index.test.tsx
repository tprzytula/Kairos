import { render, screen, renderHook } from '@testing-library/react'
import { reducer, initialState, AppStateProvider, useAppState } from './index'
import { Action, Actions } from './types'

describe('Given the AppStateProvider component', () => {
  it('should render the component', () => {
    render(
      <AppStateProvider>
        <div>Test</div>
      </AppStateProvider>
    )
    expect(screen.getByText('Test')).toBeVisible()
  })
})

describe('Given the useAppState hook', () => {
  it('should return the state and dispatch', () => {
    const { result } = renderHook(() => useAppState(), {
      wrapper: AppStateProvider,
    })

    expect(result.current.state).toBe(initialState)
    expect(result.current.dispatch).toBeDefined()
  })
})

describe('Given the reducer', () => {
  describe('When SET_GROCERY_LIST action is invoked', () => {
    it('should update the grocery list', () => {
      const exampleGroceryList = [
        {
          id: '1',
          name: 'Milk',
          quantity: 5,
        },
        {
          id: '2',
          name: 'Paper Towel',
          quantity: 2,
        },
      ]

      const result = reducer(initialState, {
        type: Actions.SET_GROCERY_LIST,
        payload: exampleGroceryList,
      })

      expect(result).toStrictEqual({
        ...initialState,
        groceryList: exampleGroceryList,
      })
    })
  })

  describe('When an unknown action is invoked', () => {
    it('should return the initial state', () => {
      const result = reducer(initialState, {
        type: 'UNKNOWN',
        payload: [],
      } as unknown as Action)
      expect(result).toStrictEqual(initialState)
    })
  })
})
