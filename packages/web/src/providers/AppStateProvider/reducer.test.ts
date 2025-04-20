import { initialState } from "."
import { ActionName } from "./enums"
import { reducer } from "./reducer"
import { Action } from "./types"
import { IAlert } from "../../components/Alert/types"

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

  describe('When the SHOW_ALERT action is invoked', () => {
    it('should add an alert to the state', () => {
      const result = reducer(initialState, {
        type: ActionName.SHOW_ALERT,
        payload: {
          id: EXAMPLE_ALERT.id,
          description: EXAMPLE_ALERT.description,
          severity: EXAMPLE_ALERT.severity,
        },
      })

      expect(result.alerts).toStrictEqual(new Map([
        [EXAMPLE_ALERT.id, EXAMPLE_ALERT],
      ]))
    })
  })

  describe('When the HIDE_ALERT action is invoked', () => {
    it('should remove an alert from the state', () => {
      const state = {
        ...initialState,
        alerts: new Map([
          [EXAMPLE_ALERT.id, EXAMPLE_ALERT],
        ]),
      }
      const result = reducer(state, {
        type: ActionName.HIDE_ALERT,
        payload: {
          id: EXAMPLE_ALERT.id,
        },
      })

      expect(result.alerts).toStrictEqual(new Map())
    })
  })

  describe('When the PURCHASE_GROCERY_ITEM action is invoked', () => {
    it('should add an item to the purchasedItems set', () => {
      const result = reducer(initialState, {
        type: ActionName.PURCHASE_GROCERY_ITEM,
        payload: { id: EXAMPLE_GROCERY_ITEM.id },
      })

      expect(result.purchasedItems).toStrictEqual(new Set([EXAMPLE_GROCERY_ITEM.id]))
    })
  })  

  describe('When the CLEAR_PURCHASED_ITEM action is invoked', () => {
    it('should remove an item from the purchasedItems set', () => {
      const state = {
        ...initialState,
        purchasedItems: new Set([EXAMPLE_GROCERY_ITEM.id]),
      }
      const result = reducer(state, {
        type: ActionName.CLEAR_PURCHASED_ITEM,
        payload: { id: EXAMPLE_GROCERY_ITEM.id },
      })

      expect(result.purchasedItems).toStrictEqual(new Set())
    })
  })
})

const EXAMPLE_ALERT: IAlert = {
  id: 'random-uuid',
  description: 'Test',
  severity: 'success',
}

const EXAMPLE_GROCERY_ITEM = {
  id: 'random-uuid',
  name: 'Test',
  quantity: 1,
  unit: 'kg',
}
