import { getUserPreferences } from './index'
import { API_BASE_URL } from '../../index'
import { createFetchOptions } from '../../../utils/api'

jest.mock('../../../utils/api', () => ({
  createFetchOptions: jest.fn()
}))

const mockCreateFetchOptions = createFetchOptions as jest.MockedFunction<typeof createFetchOptions>

describe('Given the getUserPreferences function', () => {
  beforeEach(() => {
    mockCreateFetchOptions.mockReturnValue({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-access-token'
      }
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should make the correct request to the API', async () => {
    const mockResponse = {
      userId: 'test-user-id',
      currentProjectId: 'project-123',
      lastUpdated: 1234567890
    }

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    })

    const result = await getUserPreferences('test-access-token')

    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/user/preferences`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-access-token'
        }
      }
    )

    expect(result).toEqual(mockResponse)

    expect(mockCreateFetchOptions).toHaveBeenCalledWith({}, undefined, 'test-access-token')
  })

  it('should handle API errors', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500
    })

    await expect(getUserPreferences('test-access-token')).rejects.toThrow(
      'Failed to retrieve user preferences'
    )
  })

  it('should work without access token', async () => {
    const mockResponse = {
      userId: 'test-user-id',
      lastUpdated: 1234567890
    }

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    })

    await getUserPreferences()

    expect(mockCreateFetchOptions).toHaveBeenCalledWith({}, undefined, undefined)
  })
})
