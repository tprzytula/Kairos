import { updateGroceryItem, updateGroceryItemFields } from "."
import { GroceryItemUnit } from '../../../enums/groceryItem'
import { FetchMock } from 'jest-fetch-mock'

const fetchMock = fetch as FetchMock

describe('Given the updateGroceryItem function', () => {
  it('should make the correct request to the API', async () => {
    fetchMock.mockResponse(JSON.stringify({}))

    await updateGroceryItem('test-id', 5)

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/grocery_list/items/test-id',
      {
        method: 'PATCH',
        body: JSON.stringify({ id: 'test-id', quantity: '5' }),
        headers: {
          'X-Project-ID': 'legacy-shared-project',
          'Content-Type': 'application/json',
        },
      }
    )
  })

  describe('When the API call fails', () => {
    it('should throw an error', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'API call failed' }), {
        status: 500,
      })

      await expect(updateGroceryItem('test-id', 5)).rejects.toThrow('Failed to update grocery item')
    })
  })
})

describe('Given the updateGroceryItemFields function', () => {
  it('should make the correct request with all fields', async () => {
    fetchMock.mockResponse(JSON.stringify({}))

    await updateGroceryItemFields('test-id', {
      name: 'Test Item',
      quantity: 3,
      unit: GroceryItemUnit.KILOGRAM,
      imagePath: '/test.png'
    })

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/grocery_list/items/test-id',
      {
        method: 'PATCH',
        body: JSON.stringify({
          id: 'test-id',
          name: 'Test Item',
          quantity: '3',
          unit: GroceryItemUnit.KILOGRAM,
          imagePath: '/test.png'
        }),
        headers: {
          'X-Project-ID': 'legacy-shared-project',
          'Content-Type': 'application/json',
        },
      }
    )
  })

  it('should make the correct request with partial fields', async () => {
    fetchMock.mockResponse(JSON.stringify({}))

    await updateGroceryItemFields('test-id', {
      name: 'Updated Name',
      quantity: 5
    })

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/grocery_list/items/test-id',
      {
        method: 'PATCH',
        body: JSON.stringify({
          id: 'test-id',
          name: 'Updated Name',
          quantity: '5',
          unit: undefined,
          imagePath: undefined
        }),
        headers: {
          'X-Project-ID': 'legacy-shared-project',
          'Content-Type': 'application/json',
        },
      }
    )
  })

  describe('When the API call fails', () => {
    it('should throw an error', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'API call failed' }), {
        status: 500,
      })

      await expect(updateGroceryItemFields('test-id', { name: 'Test' })).rejects.toThrow('Failed to update grocery item')
    })
  })
}) 