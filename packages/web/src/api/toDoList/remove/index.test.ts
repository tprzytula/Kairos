import { removeTodoItems } from "."
import { FetchMock } from 'jest-fetch-mock'

const fetchMock = fetch as FetchMock

describe('Given the removeTodoItems function', () => {
  it('should make the correct request to the API', async () => {
    await removeTodoItems(['1', '2'])

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/todo_list/items',
      {
        method: 'DELETE',
        body: JSON.stringify({ ids: ['1', '2'] }),
        headers: {
          'X-Project-ID': 'legacy-shared-project',
          'Content-Type': 'application/json',
        },
      }
    )
  })

  it('should include the Authorization header when an access token is provided', async () => {
    await removeTodoItems(['1', '2'], 'test-project-id', 'test-access-token')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/todo_list/items',
      {
        method: 'DELETE',
        body: JSON.stringify({ ids: ['1', '2'] }),
        headers: {
          'X-Project-ID': 'test-project-id',
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

      await expect(removeTodoItems(['1', '2'])).rejects.toThrow('Failed to remove todo items')
    })
  })
})
