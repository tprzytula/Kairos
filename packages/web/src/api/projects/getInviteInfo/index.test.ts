import { getProjectInviteInfo } from '.'
import { FetchMock } from 'jest-fetch-mock'

const fetchMock = fetch as FetchMock

const testInviteCode = 'invite-abc123'

const exampleResponse = {
  projectId: 'project-123',
  projectName: 'Test Project',
  ownerName: 'John Doe',
  memberCount: 3,
  maxMembers: 5
}

describe('Given the getProjectInviteInfo function', () => {
  it('should make the correct request to the API without access token', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse))

    await getProjectInviteInfo(testInviteCode)

    expect(fetchMock).toHaveBeenCalledWith(
      `https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/projects/invite/${testInviteCode}`,
      {
        headers: {
          'X-Project-ID': 'legacy-shared-project',
          'Content-Type': 'application/json',
        },
      }
    )
  })

  it('should make the correct request to the API with access token', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse))

    await getProjectInviteInfo(testInviteCode, 'test-access-token')

    expect(fetchMock).toHaveBeenCalledWith(
      `https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/projects/invite/${testInviteCode}`,
      {
        headers: {
          'X-Project-ID': 'legacy-shared-project',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-access-token',
        },
      }
    )
  })

  it('should return the project invite info on success', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse))

    const result = await getProjectInviteInfo(testInviteCode, 'test-access-token')

    expect(result).toStrictEqual(exampleResponse)
  })

  describe('When the API call fails', () => {
    it('should throw an error', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'API call failed' }), {
        status: 500,
      })

      await expect(getProjectInviteInfo(testInviteCode, 'test-access-token')).rejects.toThrow('Failed to get project invite info')
    })
  })
})
