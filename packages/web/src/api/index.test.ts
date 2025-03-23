import { retrieveGroceryList } from '.'
import { FetchMock } from 'jest-fetch-mock'

const fetchMock = fetch as FetchMock
const exampleResponse = [
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

describe('Given the retrieveItems function', () => {
  it('should make the correct request to the API', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse))

    await retrieveGroceryList()

    expect(fetchMock).toHaveBeenCalledWith('TBD/grocery_list/items')
  })

  it('should return the items on success', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse))

    const result = await retrieveGroceryList()

    expect(result).toStrictEqual(exampleResponse)
  })
})
