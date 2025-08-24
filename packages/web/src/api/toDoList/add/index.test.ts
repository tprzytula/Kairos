import { addTodoItem } from '.'
import { FetchMock } from 'jest-fetch-mock'
import { ITodoItem } from '../retrieve/types'

const fetchMock = fetch as FetchMock
const EXAMPLE_RESPONSE: ITodoItem = {
  id: '1',
  name: 'Groceries',
  description: 'Buy groceries for the week',
  isDone: false,
  dueDate: 1746042442000,
}

describe('Given the addTodoItem function', () => {
  it('should make the correct request to the API with legacy project when no project ID provided', async () => {
    fetchMock.mockResponse(JSON.stringify(EXAMPLE_RESPONSE))

    await addTodoItem({
      name: 'Groceries',
      description: 'Buy groceries for the week',
    })

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/todo_list/items',
      {
        method: 'PUT',
        body: JSON.stringify({ name: 'Groceries', description: 'Buy groceries for the week', isDone: false }),
        headers: {
          'X-Project-ID': 'legacy-shared-project',
          'Content-Type': 'application/json',
        },
      }
    )
  })

  it('should make the correct request to the API with provided project ID', async () => {
    fetchMock.mockResponse(JSON.stringify(EXAMPLE_RESPONSE))

    await addTodoItem({
      name: 'Groceries',
      description: 'Buy groceries for the week',
    }, 'test-project-id', 'test-access-token')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/todo_list/items',
      {
        method: 'PUT',
        body: JSON.stringify({ name: 'Groceries', description: 'Buy groceries for the week', isDone: false }),
        headers: {
          'X-Project-ID': 'test-project-id',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-access-token',
        },
      }
    )
  })

  it('should return the created item', async () => {
    fetchMock.mockResponse(JSON.stringify(EXAMPLE_RESPONSE))

    const result = await addTodoItem({
      name: 'Milk',
      description: 'Buy groceries for the week',
    })

    expect(result).toStrictEqual(EXAMPLE_RESPONSE)
  })

  describe('When the API call fails', () => {
    it('should throw an error', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'API call failed' }), {
        status: 500,
      })

      await expect(addTodoItem({
        name: 'Milk',
        description: 'Buy groceries for the week',
      })).rejects.toThrow('Failed to add a todo item')
    })
  })

  describe('When the returned data does not contain an id', () => {
    it('should throw an error', async () => {
      fetchMock.mockResponse(JSON.stringify({
        ...EXAMPLE_RESPONSE,
        id: undefined,
      }), {
        status: 200,
      })

      await expect(addTodoItem({
        name: 'Milk',
        description: 'Buy groceries for the week',
      })).rejects.toThrow('Unexpected response from API')
    })
  })
})