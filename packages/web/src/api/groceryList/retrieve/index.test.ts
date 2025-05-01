import { retrieveGroceryList } from '.'
import { FetchMock } from 'jest-fetch-mock'
import { GroceryItemUnit } from '../../../enums/groceryItem'

const fetchMock = fetch as FetchMock
const exampleResponse = [
  {
    id: '1',
    name: 'Milk',
    quantity: 5,
    unit: GroceryItemUnit.LITER,
  },
  {
    id: '2',
    name: 'Paper Towel',
    quantity: 2,
    unit: GroceryItemUnit.UNIT,
  },
]

describe('Given the retrieveItems function', () => {
  it('should make the correct request to the API', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse))

    await retrieveGroceryList()

    expect(fetchMock).toHaveBeenCalledWith(
      'https://crff1u9wbc.execute-api.eu-west-2.amazonaws.com/v1/grocery_list/items'
    )
  })

  it('should return the items on success', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse))

    const result = await retrieveGroceryList()

    expect(result).toStrictEqual(exampleResponse)
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
