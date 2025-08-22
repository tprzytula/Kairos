import { addGroceryItem } from '.'
import { FetchMock } from 'jest-fetch-mock'
import { GroceryItemUnit } from '../../../enums/groceryItem'

const fetchMock = fetch as FetchMock
const exampleResponse = [
  {
    id: '1',
    name: 'Milk',
    quantity: 5,
    unit: GroceryItemUnit.LITER,
    imagePath: '/assets/icons/milk.png',
  },
  {
    id: '2',
    name: 'Paper Towel',
    quantity: 2,
    unit: GroceryItemUnit.UNIT,
    imagePath: '/assets/icons/generic-grocery-item.png',
  },
]

describe('Given the addGroceryItem function', () => {
  it('should make the correct request to the API with legacy project when no project ID provided', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse[0]))

    await addGroceryItem({
      name: 'Milk',
      quantity: 5,
      unit: GroceryItemUnit.LITER,
      imagePath: '/assets/icons/milk.png'
    })

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/grocery_list/items',
      {
        method: 'PUT',
        body: JSON.stringify({ name: 'Milk', quantity: 5, unit: GroceryItemUnit.LITER, imagePath: '/assets/icons/milk.png' }),
        headers: {
          'X-Project-ID': 'legacy-shared-project',
          'Content-Type': 'application/json',
        },
      }
    )
  })

  it('should make the correct request to the API with provided project ID', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse[0]))

    await addGroceryItem({
      name: 'Milk',
      quantity: 5,
      unit: GroceryItemUnit.LITER,
      imagePath: '/assets/icons/milk.png'
    }, 'test-project-id')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/grocery_list/items',
      {
        method: 'PUT',
        body: JSON.stringify({ name: 'Milk', quantity: 5, unit: GroceryItemUnit.LITER, imagePath: '/assets/icons/milk.png' }),
        headers: {
          'X-Project-ID': 'test-project-id',
          'Content-Type': 'application/json',
        },
      }
    )
  })

  it('should return the created item', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse[0]))

    const result = await addGroceryItem({
      name: 'Milk',
      quantity: 5,
      unit: GroceryItemUnit.LITER,
      imagePath: '/assets/icons/milk.png'
    })

    expect(result).toStrictEqual(exampleResponse[0])
  })

  describe('When the API call fails', () => {
    it('should throw an error', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'API call failed' }), {
        status: 500,
      })

      await expect(addGroceryItem({
        name: 'Milk',
        quantity: 5,
        unit: GroceryItemUnit.LITER,
        imagePath: '/assets/icons/milk.png'
      })).rejects.toThrow('Failed to add a grocery item')
    })
  })

  describe('When the returned data does not contain an id', () => {
    it('should throw an error', async () => {
      fetchMock.mockResponse(JSON.stringify({ name: 'Milk', quantity: 5 }), {
        status: 200,
      })

      await expect(addGroceryItem({
        name: 'Milk',
        quantity: 5,
        unit: GroceryItemUnit.LITER,
        imagePath: '/assets/icons/milk.png'
      })).rejects.toThrow('Unexpected response from API')
    })
  })
})