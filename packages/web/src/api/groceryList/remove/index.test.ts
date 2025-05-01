import { removeGroceryItems } from "."
import { FetchMock } from 'jest-fetch-mock'

const fetchMock = fetch as FetchMock

describe('Given the removeGroceryItems function', () => {
  it('should make the correct request to the API', async () => {
    await removeGroceryItems(['1', '2'])

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/grocery_list/items',
      {
        method: 'DELETE',
        body: JSON.stringify({ ids: ['1', '2'] }),
      }
    )
  })

  describe('When the API call fails', () => {
    it('should throw an error', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'API call failed' }), {
        status: 500,
      })

      await expect(removeGroceryItems(['1', '2'])).rejects.toThrow('Failed to remove grocery items')
    })
  })
})
