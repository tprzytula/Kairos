import { retrieveUserProjects } from './index'
import { createFetchOptions } from '../../../utils/api'

jest.mock('../../../utils/api', () => ({
  createFetchOptions: jest.fn()
}))

const mockCreateFetchOptions = createFetchOptions as jest.MockedFunction<typeof createFetchOptions>

global.fetch = jest.fn()
const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('retrieveUserProjects', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCreateFetchOptions.mockReturnValue({
      headers: { 'Content-Type': 'application/json' }
    })
  })

  it('should retrieve user projects successfully', async () => {
    const mockProjects = [
      {
        id: 'project-1',
        ownerId: 'user-1',
        name: 'Test Project',
        isPersonal: true,
        maxMembers: 1,
        inviteCode: 'invite-123',
        createdAt: '2023-01-01T00:00:00Z'
      }
    ]

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockProjects,
    } as Response)

    const result = await retrieveUserProjects('test-access-token')

    expect(mockFetch).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/projects',
      { headers: { 'Content-Type': 'application/json' } }
    )
    expect(result).toEqual(mockProjects)
  })

  it('should throw error when API call fails', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
    } as Response)

    await expect(retrieveUserProjects('test-access-token')).rejects.toThrow('Failed to retrieve user projects')
  })

  it('should handle network errors', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'))

    await expect(retrieveUserProjects('test-access-token')).rejects.toThrow('Network error')
  })
})
