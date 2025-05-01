import { addNoiseTrackingItem } from '.'
import { FetchMock } from 'jest-fetch-mock'

const fetchMock = fetch as FetchMock

describe('Given the addNoiseTrackingItem function', () => {
  it('should make the correct request to the API', async () => {
    fetchMock.mockResponse(JSON.stringify({}))

    await addNoiseTrackingItem()

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/noise_tracking',
      {
        method: 'PUT',
      }
    )
  })

  it('should throw an error when the API call fails', async () => {
    fetchMock.mockResponse(JSON.stringify({ error: 'API call failed' }), {
      status: 500,
    })

    await expect(addNoiseTrackingItem()).rejects.toThrow('Failed to add a noise tracking item')
  })
})
