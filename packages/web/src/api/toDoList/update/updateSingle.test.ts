import { updateToDoItemFields } from './updateSingle'
import { FetchMock } from 'jest-fetch-mock'

const fetchMock = fetch as FetchMock

describe('Given the updateToDoItemFields function', () => {
  it('should make the correct request with all fields', async () => {
    fetchMock.mockResponse(JSON.stringify({}))

    await updateToDoItemFields('test-id', {
      name: 'Updated Todo',
      description: 'Updated description',
      dueDate: 1234567890,
      isDone: true
    })

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/todo_list/items/test-id',
      {
        method: 'PATCH',
        body: JSON.stringify({
          id: 'test-id',
          name: 'Updated Todo',
          description: 'Updated description',
          dueDate: 1234567890,
          isDone: true
        }),
      }
    )
  })

  it('should make the correct request with partial fields', async () => {
    fetchMock.mockResponse(JSON.stringify({}))

    await updateToDoItemFields('test-id', {
      name: 'Updated Name Only',
      isDone: false
    })

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/todo_list/items/test-id',
      {
        method: 'PATCH',
        body: JSON.stringify({
          id: 'test-id',
          name: 'Updated Name Only',
          isDone: false
        }),
      }
    )
  })

  it('should make the correct request with only name', async () => {
    fetchMock.mockResponse(JSON.stringify({}))

    await updateToDoItemFields('test-id', {
      name: 'Just Name Update'
    })

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/todo_list/items/test-id',
      {
        method: 'PATCH',
        body: JSON.stringify({
          id: 'test-id',
          name: 'Just Name Update'
        }),
      }
    )
  })

  describe('When the API call fails', () => {
    it('should throw an error', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'API call failed' }), {
        status: 500,
      })

      await expect(updateToDoItemFields('test-id', { name: 'Test' })).rejects.toThrow('Failed to update todo item')
    })
  })
})