import { joinProject } from '.'
import { FetchMock } from 'jest-fetch-mock'
import { IJoinProjectRequest } from '../../../types/project'

const fetchMock = fetch as FetchMock

const exampleJoinRequest: IJoinProjectRequest = {
  inviteCode: 'invite-abc123'
}

describe('Given the joinProject function', () => {
  it('should make the correct request to the API without access token', async () => {
    fetchMock.mockResponse(JSON.stringify({}))

    await joinProject(exampleJoinRequest)

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/projects/join',
      {
        method: 'POST',
        body: JSON.stringify(exampleJoinRequest),
        headers: {
          'X-Project-ID': 'legacy-shared-project',
          'Content-Type': 'application/json',
        },
      }
    )
  })

  it('should make the correct request to the API with access token', async () => {
    fetchMock.mockResponse(JSON.stringify({}))

    await joinProject(exampleJoinRequest, 'test-access-token')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/projects/join',
      {
        method: 'POST',
        body: JSON.stringify(exampleJoinRequest),
        headers: {
          'X-Project-ID': 'legacy-shared-project',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-access-token',
        },
      }
    )
  })

  describe('When the API call fails', () => {
    it('should throw an error', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'API call failed' }), {
        status: 500,
      })

      await expect(joinProject(exampleJoinRequest, 'test-access-token')).rejects.toThrow('Failed to join project')
    })
  })
})
