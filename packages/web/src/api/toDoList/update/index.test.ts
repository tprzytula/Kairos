import { updateToDoItems } from '.'
import { FetchMock } from 'jest-fetch-mock'
import { ITodoItemUpdate } from './types'

const fetchMock = fetch as FetchMock

describe('Given the updateToDoItems function', () => {
  it('should make the correct request to the API', async () => {
    fetchMock.mockResponse(JSON.stringify(EXAMPLE_UPDATE_TODO_ITEMS_REQUEST))

    await updateToDoItems(EXAMPLE_UPDATE_TODO_ITEMS_REQUEST)

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/todo_list/items'
    )
  })

  it('should return the items on success', async () => {
    fetchMock.mockResponse(JSON.stringify(EXAMPLE_UPDATE_TODO_ITEMS_REQUEST))

    const result = await updateToDoItems(EXAMPLE_UPDATE_TODO_ITEMS_REQUEST)

    expect(result).toStrictEqual(EXAMPLE_UPDATE_TODO_ITEMS_REQUEST)
  })

  describe('When the API call fails', () => {
    it('should return an empty array', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'API call failed' }), {
        status: 500,
      })

      const result = await updateToDoItems(EXAMPLE_UPDATE_TODO_ITEMS_REQUEST)

      expect(result).toStrictEqual([])
    })
  })
})

const EXAMPLE_UPDATE_TODO_ITEMS_REQUEST: Array<ITodoItemUpdate> = [
  {
    id: '1',
    isDone: false,
  },
  {
    id: '2',
    isDone: false,
  },
]
