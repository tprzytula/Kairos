import { updateUserPreferences } from './index'
import { API_BASE_URL } from '../../index'
import { createFetchOptions } from '../../../utils/api'

jest.mock('../../../utils/api', () => ({
  createFetchOptions: jest.fn()
}))

const mockCreateFetchOptions = createFetchOptions as jest.MockedFunction<typeof createFetchOptions>

describe('Given the updateUserPreferences function', () => {
  beforeEach(() => {
    mockCreateFetchOptions.mockReturnValue({
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-access-token'
      },
      body: JSON.stringify({ currentProjectId: 'project-123' })
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should make the correct request to the API', async () => {
    const requestData = { currentProjectId: 'project-123' }
    const mockResponse = {
      userId: 'test-user-id',
      currentProjectId: 'project-123',
      lastUpdated: 1234567890
    }

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    })

    const result = await updateUserPreferences(requestData, 'test-access-token')

    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/user/preferences`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-access-token'
        },
        body: JSON.stringify(requestData)
      }
    )

    expect(result).toEqual(mockResponse)

    expect(mockCreateFetchOptions).toHaveBeenCalledWith({
      method: 'PUT',
      body: JSON.stringify(requestData),
    }, undefined, 'test-access-token')
  })

  it('should handle API errors', async () => {
    const requestData = { currentProjectId: 'project-123' }

    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500
    })

    await expect(updateUserPreferences(requestData, 'test-access-token')).rejects.toThrow(
      'Failed to update user preferences'
    )
  })

  it('should work without access token', async () => {
    const requestData = { currentProjectId: 'project-123' }
    const mockResponse = {
      userId: 'test-user-id',
      currentProjectId: 'project-123',
      lastUpdated: 1234567890
    }

    mockCreateFetchOptions.mockReturnValue({
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    })

    await updateUserPreferences(requestData)

    expect(mockCreateFetchOptions).toHaveBeenCalledWith({
      method: 'PUT',
      body: JSON.stringify(requestData),
    }, undefined, undefined)
  })

  it('should handle undefined currentProjectId', async () => {
    const requestData = { currentProjectId: undefined }
    const mockResponse = {
      userId: 'test-user-id',
      currentProjectId: undefined,
      lastUpdated: 1234567890
    }

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    })

    const result = await updateUserPreferences(requestData, 'test-access-token')

    expect(result).toEqual(mockResponse)
  })
})
