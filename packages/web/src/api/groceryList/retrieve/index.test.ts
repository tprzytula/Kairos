import { retrieveGroceryList, retrieveGroceryListDefaults } from '.'
import { FetchMock } from 'jest-fetch-mock'
import { GroceryItemUnit } from '../../../enums/groceryItem'
import { IDBGroceryItem, IDBGroceryItemDefault } from './types'

const fetchMock = fetch as FetchMock

describe('Given the retrieveItems function', () => {
  it('should make the correct request to the API', async () => {
    fetchMock.mockResponse(JSON.stringify(EXAMPLE_GROCERY_LIST_RESPONSE))

    await retrieveGroceryList()

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/grocery_list/items'
    )
  })

  it('should return the items on success', async () => {
    fetchMock.mockResponse(JSON.stringify(EXAMPLE_GROCERY_LIST_RESPONSE))

    const result = await retrieveGroceryList()

    expect(result).toStrictEqual(EXAMPLE_GROCERY_LIST_RESPONSE)
  })

  describe('When the API call fails', () => {
    it('should return an empty array', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'API call failed' }), {
        status: 500,
      })

      const result = await retrieveGroceryList()

      expect(result).toStrictEqual([])
    })
  })
})

describe('Given the retrieveItemsDefaults function', () => {
  it('should make the correct request to the API', async () => {
    fetchMock.mockResponse(JSON.stringify(EXAMPLE_GROCERY_LIST_DEFAULTS_RESPONSE))

    await retrieveGroceryListDefaults()

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/grocery_list/items_defaults'
    )
  })

  it('should return the items on success', async () => {
    fetchMock.mockResponse(JSON.stringify(EXAMPLE_GROCERY_LIST_DEFAULTS_RESPONSE))

    const result = await retrieveGroceryListDefaults()

    expect(result).toStrictEqual(EXAMPLE_GROCERY_LIST_DEFAULTS_RESPONSE)
  })

  describe('When the API call fails', () => {
    it('should return an empty array', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'API call failed' }), {
        status: 500,
      })

      const result = await retrieveGroceryList()

      expect(result).toStrictEqual([])
    })
  })
})

const EXAMPLE_GROCERY_LIST_RESPONSE: Array<IDBGroceryItem> = [
  {
    id: '1',
    name: 'Milk',
    quantity: 5,
    unit: GroceryItemUnit.LITER,
    imagePath: '/assets/icons/milk.png',
  },
  {
    id: '2',
    name: 'Paper Towel',
    quantity: 2,
    unit: GroceryItemUnit.UNIT,
    imagePath: '/assets/icons/paper-towel.png',
  },
]

const EXAMPLE_GROCERY_LIST_DEFAULTS_RESPONSE: Array<IDBGroceryItemDefault> = [
  {
    name: 'Milk',
    unit: GroceryItemUnit.LITER,
    icon: '/assets/icons/milk.png',
  },
  {
    name: 'Paper Towel',
    unit: GroceryItemUnit.UNIT,
    icon: '/assets/icons/paper-towel.png',
  },
]
