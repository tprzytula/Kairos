import { initialState, Actions } from "."
import { reducer } from "./reducer"
import { Action } from "./types"

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
