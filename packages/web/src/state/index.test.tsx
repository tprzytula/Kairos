import { reducer, initialState } from './index'
import { Actions } from './types'

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
})
