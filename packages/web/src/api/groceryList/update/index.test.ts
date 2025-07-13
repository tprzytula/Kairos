import { updateGroceryItem } from "."
import { FetchMock } from 'jest-fetch-mock'

const fetchMock = fetch as FetchMock

describe('Given the updateGroceryItem function', () => {
  it('should make the correct request to the API', async () => {
    fetchMock.mockResponse(JSON.stringify({}))

    await updateGroceryItem('test-id', 5)

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/grocery_list/items/test-id',
      {
        method: 'PATCH',
        body: JSON.stringify({ id: 'test-id', quantity: '5' }),
      }
    )
  })

  describe('When the API call fails', () => {
    it('should throw an error', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'API call failed' }), {
        status: 500,
      })

      await expect(updateGroceryItem('test-id', 5)).rejects.toThrow('Failed to update grocery item')
    })
  })
}) 