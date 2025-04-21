import { retrieveGroceryListIcons } from '.'
import { FetchMock } from 'jest-fetch-mock'

const fetchMock = fetch as FetchMock
const exampleResponse = [
  {
    name: 'Milk',
    path: 'https://hostname.com/items_icons/milk.png',
  },
  {
    name: 'Paper Towel',
    path: 'https://hostname.com/items_icons/paper_towel.png',
  },
]

describe('Given the retrieveItems function', () => {
  it('should make the correct request to the API', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse))

    await retrieveGroceryListIcons()

    expect(fetchMock).toHaveBeenCalledWith(
      'https://crff1u9wbc.execute-api.eu-west-2.amazonaws.com/v1/grocery_list/items_icons'
    )
  })

  it('should return the items on success', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse))

    const result = await retrieveGroceryListIcons()

    expect(result).toStrictEqual(exampleResponse)
  })

  describe('When the API call fails', () => {
    it('should return an empty array', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'API call failed' }), {
        status: 500,
      })

      const result = await retrieveGroceryListIcons()

      expect(result).toStrictEqual([])
    })
  })
})
