import { retrieveNoiseTrackingItems } from '.'
import { FetchMock } from 'jest-fetch-mock'

const fetchMock = fetch as FetchMock
const exampleResponse = [
  {
    timestamp: 1714003200000,
  },
  {
    timestamp: 1714003200000,
  },
]

describe('Given the retrieveNoiseTracking Items function', () => {
  it('should make the correct request to the API', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse))

    await retrieveNoiseTrackingItems()

    expect(fetchMock).toHaveBeenCalledWith(
      'https://crff1u9wbc.execute-api.eu-west-2.amazonaws.com/v1/noise_tracking'
    )
  })

  it('should return the items on success', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse))

    const result = await retrieveNoiseTrackingItems()

    expect(result).toStrictEqual(exampleResponse)
  })

  describe('When the API call fails', () => {
    it('should return an empty array', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'API call failed' }), {
        status: 500,
      })

      const result = await retrieveNoiseTrackingItems()

      expect(result).toStrictEqual([])
    })
  })
})
