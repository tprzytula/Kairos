import { removeNoiseTrackingItem } from "."
import { FetchMock } from 'jest-fetch-mock'

const fetchMock = fetch as FetchMock

describe('Given the removeNoiseTrackingItem function', () => {
  it('should make the correct request to the API', async () => {
    await removeNoiseTrackingItem(1714003200000)

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/noise_tracking/items/1714003200000',
      {
        method: 'DELETE',
      }
    )
  })

  describe('When the API call fails', () => {
    it('should throw an error', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'API call failed' }), {
        status: 500,
      })

      await expect(removeNoiseTrackingItem(1714003200000)).rejects.toThrow('Failed to remove noise tracking item')
    })
  })
})
