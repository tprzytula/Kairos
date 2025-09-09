import { retrieveShops } from '.'
import { FetchMock } from 'jest-fetch-mock'
import { IDBShop } from '../types'

const fetchMock = fetch as FetchMock

const exampleResponse: Array<IDBShop> = [
  {
    id: 'shop-1',
    projectId: 'project-123',
    name: 'Grocery Store',
    icon: '/assets/icons/grocery.png',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'shop-2',
    projectId: 'project-123',
    name: 'Hardware Store',
    icon: '/assets/icons/hardware.png',
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z'
  }
]

describe('Given the retrieveShops function', () => {
  it('should make the correct request to the API with legacy project when no project ID provided', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse))

    await retrieveShops()

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/shops',
      {
        headers: {
          'X-Project-ID': 'legacy-shared-project',
          'Content-Type': 'application/json',
        },
      }
    )
  })

  it('should make the correct request to the API with provided project ID', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse))

    await retrieveShops('test-project-id')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/shops',
      {
        headers: {
          'X-Project-ID': 'test-project-id',
          'Content-Type': 'application/json',
        },
      }
    )
  })

  it('should return the shops on success', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse))

    const result = await retrieveShops()

    expect(result).toStrictEqual(exampleResponse)
  })

  describe('When the API call fails', () => {
    it('should return an empty array', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'API call failed' }), {
        status: 500,
      })

      const result = await retrieveShops()

      expect(result).toStrictEqual([])
    })
  })
})
