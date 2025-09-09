import { savePushSubscription } from '.'
import { FetchMock } from 'jest-fetch-mock'
import { PushSubscriptionData } from '../types'

const fetchMock = fetch as FetchMock

const exampleSubscriptionData: PushSubscriptionData = {
  endpoint: 'https://fcm.googleapis.com/fcm/send/test-endpoint',
  keys: {
    p256dh: 'test-p256dh-key',
    auth: 'test-auth-key'
  }
}

const exampleResponse = {
  success: true
}

describe('Given the savePushSubscription function', () => {
  it('should make the correct request to the API', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse))

    await savePushSubscription(exampleSubscriptionData, 'test-access-token')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/push-subscriptions',
      {
        method: 'POST',
        body: JSON.stringify(exampleSubscriptionData),
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

    const result = await savePushSubscription(exampleSubscriptionData, 'test-access-token')

    expect(result).toStrictEqual(exampleResponse)
  })

  describe('When the API call fails', () => {
    it('should throw an error', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'API call failed' }), {
        status: 500,
      })

      await expect(savePushSubscription(exampleSubscriptionData, 'test-access-token')).rejects.toThrow('Failed to save push subscription')
    })
  })
})
