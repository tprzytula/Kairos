import { deletePushSubscription } from '.'
import { FetchMock } from 'jest-fetch-mock'

const fetchMock = fetch as FetchMock

const exampleResponse = {
  success: true
}

const testEndpoint = 'https://fcm.googleapis.com/fcm/send/test-endpoint'

describe('Given the deletePushSubscription function', () => {
  it('should make the correct request to the API', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse))

    await deletePushSubscription(testEndpoint, 'test-access-token')

    const encodedEndpoint = encodeURIComponent(testEndpoint)
    
    expect(fetchMock).toHaveBeenCalledWith(
      `https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/push-subscriptions?endpoint=${encodedEndpoint}`,
      {
        method: 'DELETE',
        headers: {
          'X-Project-ID': 'legacy-shared-project',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-access-token',
        },
      }
    )
  })

  it('should return the response on success', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse))

    const result = await deletePushSubscription(testEndpoint, 'test-access-token')

    expect(result).toStrictEqual(exampleResponse)
  })

  describe('When the API call fails', () => {
    it('should throw an error', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'API call failed' }), {
        status: 500,
      })

      await expect(deletePushSubscription(testEndpoint, 'test-access-token')).rejects.toThrow('Failed to delete push subscription')
    })
  })
})
