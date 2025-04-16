import { initialState } from "."
import { reducer } from "./reducer"
import { Action } from "./types"

describe('Given the reducer', () => {
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
