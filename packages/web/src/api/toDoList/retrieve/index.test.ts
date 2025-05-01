import { retrieveToDoList } from '.'
import { FetchMock } from 'jest-fetch-mock'
import { ITodoItem } from './types'

const fetchMock = fetch as FetchMock

describe('Given the retrieveItems function', () => {
  it('should make the correct request to the API', async () => {
    fetchMock.mockResponse(JSON.stringify(EXAMPLE_TODO_LIST_RESPONSE))

    await retrieveToDoList()

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/todo_list/items'
    )
  })

  it('should return the items on success', async () => {
    fetchMock.mockResponse(JSON.stringify(EXAMPLE_TODO_LIST_RESPONSE))

    const result = await retrieveToDoList()

    expect(result).toStrictEqual(EXAMPLE_TODO_LIST_RESPONSE)
  })

  describe('When the API call fails', () => {
    it('should return an empty array', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'API call failed' }), {
        status: 500,
      })

      const result = await retrieveToDoList()

      expect(result).toStrictEqual([])
    })
  })
})

const EXAMPLE_TODO_LIST_RESPONSE: Array<ITodoItem> = [
  {
    id: '1',
    name: 'Buy groceries',
    description: 'Buy groceries for the week',
    isDone: false,
    dueDate: '2021-01-01',
  },
  {
    id: '2',
    name: 'Go to the gym',
    description: 'Train for 30 minutes',
    isDone: false,
    dueDate: '2021-01-01',
  },
]
