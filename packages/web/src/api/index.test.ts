import { createGroceryItem, retrieveGroceryList } from '.'
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

describe('Given the createGroceryItem function', () => {
  it('should make the correct request to the API', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse[0]))

    await createGroceryItem({
      name: 'Milk',
      quantity: 5,
    })

    expect(fetchMock).toHaveBeenCalledWith(
      'https://crff1u9wbc.execute-api.eu-west-2.amazonaws.com/v1/grocery_list/items',
      {
        method: 'PUT',
        body: JSON.stringify({ name: 'Milk', quantity: 5 }),
      }
    )
  })

  it('should return the created item', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse[0]))

    const result = await createGroceryItem({
      name: 'Milk',
      quantity: 5,
    })

    expect(result).toStrictEqual(exampleResponse[0])
  })

  describe('When the API call fails', () => {
    it('should throw an error', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'API call failed' }), {
        status: 500,
      })

      await expect(createGroceryItem({
        name: 'Milk',
        quantity: 5,
      })).rejects.toThrow('Failed to create grocery item')
    })
  })

  describe('When the returned data does not contain an id', () => {
    it('should throw an error', async () => {
      fetchMock.mockResponse(JSON.stringify({ name: 'Milk', quantity: 5 }), {
        status: 200,
      })

      await expect(createGroceryItem({
        name: 'Milk',
        quantity: 5,
      })).rejects.toThrow('Unexpected response from API')
    })
  })
})