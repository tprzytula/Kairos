import { deleteShop } from '.'
import { FetchMock } from 'jest-fetch-mock'

const fetchMock = fetch as FetchMock

const testShopId = 'shop-123'

describe('Given the deleteShop function', () => {
  it('should make the correct request to the API with legacy project when no project ID provided', async () => {
    fetchMock.mockResponse(JSON.stringify({}))

    await deleteShop(testShopId)

    expect(fetchMock).toHaveBeenCalledWith(
      `https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/shops/${testShopId}`,
      {
        method: 'DELETE',
        headers: {
          'X-Project-ID': 'legacy-shared-project',
          'Content-Type': 'application/json',
        },
      }
    )
  })

  it('should make the correct request to the API with provided project ID', async () => {
    fetchMock.mockResponse(JSON.stringify({}))

    await deleteShop(testShopId, 'test-project-id')

    expect(fetchMock).toHaveBeenCalledWith(
      `https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/shops/${testShopId}`,
      {
        method: 'DELETE',
        headers: {
          'X-Project-ID': 'test-project-id',
          'Content-Type': 'application/json',
        },
      }
    )
  })

  describe('When the API call fails', () => {
    it('should throw an error', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'API call failed' }), {
        status: 500,
      })

      await expect(deleteShop(testShopId)).rejects.toThrow('Failed to delete shop')
    })
  })
})
