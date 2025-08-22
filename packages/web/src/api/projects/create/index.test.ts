import { createProject } from './index'
import { createFetchOptions } from '../../../utils/api'

jest.mock('../../../utils/api', () => ({
  createFetchOptions: jest.fn()
}))

const mockCreateFetchOptions = createFetchOptions as jest.MockedFunction<typeof createFetchOptions>

global.fetch = jest.fn()
const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('createProject', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCreateFetchOptions.mockReturnValue({
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: '{}'
    })
  })

  it('should create project successfully', async () => {
    const projectRequest = {
      name: 'New Project',
      maxMembers: 5
    }

    const mockProject = {
      id: 'project-123',
      ownerId: 'user-1',
      name: 'New Project',
      isPersonal: false,
      maxMembers: 5,
      inviteCode: 'invite-abc',
      createdAt: '2023-01-01T00:00:00Z'
    }

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockProject,
    } as Response)

    const result = await createProject(projectRequest, 'test-access-token')

    expect(mockFetch).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/projects',
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: '{}'
      }
    )
    expect(result).toEqual(mockProject)
  })

  it('should throw error when project creation fails', async () => {
    const projectRequest = {
      name: 'New Project'
    }

    mockFetch.mockResolvedValue({
      ok: false,
      status: 400,
    } as Response)

    await expect(createProject(projectRequest, 'test-access-token')).rejects.toThrow('Failed to create project')
  })

  it('should handle network errors', async () => {
    const projectRequest = {
      name: 'New Project'
    }

    mockFetch.mockRejectedValue(new Error('Network error'))

    await expect(createProject(projectRequest, 'test-access-token')).rejects.toThrow('Network error')
  })
})
