import { addNoiseTrackingItem } from '.'
import { FetchMock } from 'jest-fetch-mock'

const fetchMock = fetch as FetchMock

describe('Given the addNoiseTrackingItem function', () => {
  it('should make the correct request to the API with legacy project when no project ID provided', async () => {
    fetchMock.mockResponse(JSON.stringify({}))

    await addNoiseTrackingItem()

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/noise_tracking/items',
      {
        method: 'PUT',
        headers: {
          'X-Project-ID': 'legacy-shared-project',
          'Content-Type': 'application/json',
        },
      }
    )
  })

  it('should make the correct request to the API with provided project ID', async () => {
    fetchMock.mockResponse(JSON.stringify({}))

    await addNoiseTrackingItem('test-project-id')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/noise_tracking/items',
      {
        method: 'PUT',
        headers: {
          'X-Project-ID': 'test-project-id',
          'Content-Type': 'application/json',
        },
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
