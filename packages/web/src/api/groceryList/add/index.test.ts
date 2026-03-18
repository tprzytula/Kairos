import { addGroceryItem, addGroceryItems } from '.'
import { FetchMock } from 'jest-fetch-mock'
import { GroceryItemUnit } from '../../../enums/groceryItem'

const fetchMock = fetch as FetchMock

describe('Given the addGroceryItems function', () => {
  it('should send items in batch format', async () => {
    fetchMock.mockResponse(JSON.stringify({ items: [{ id: '1' }, { id: '2' }] }))

    await addGroceryItems([
      { name: 'Milk', quantity: 5, unit: GroceryItemUnit.LITER, shopId: 'shop-1', imagePath: '/assets/icons/milk.png' },
      { name: 'Eggs', quantity: 6, unit: GroceryItemUnit.UNIT, shopId: 'shop-1', imagePath: '/assets/icons/eggs.png' },
    ], 'test-project-id')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/grocery_list/items',
      {
        method: 'PUT',
        body: JSON.stringify({
          items: [
            { name: 'Milk', quantity: 5, unit: GroceryItemUnit.LITER, shopId: 'shop-1', imagePath: '/assets/icons/milk.png' },
            { name: 'Eggs', quantity: 6, unit: GroceryItemUnit.UNIT, shopId: 'shop-1', imagePath: '/assets/icons/eggs.png' },
          ],
        }),
        headers: {
          'X-Project-ID': 'test-project-id',
          'Content-Type': 'application/json',
        },
      }
    )
  })

  it('should return the items array from the response', async () => {
    fetchMock.mockResponse(JSON.stringify({ items: [{ id: '1' }, { id: '2' }] }))

    const result = await addGroceryItems([
      { name: 'Milk', quantity: 5, unit: GroceryItemUnit.LITER, shopId: 'shop-1', imagePath: '/assets/icons/milk.png' },
    ], 'test-project-id')

    expect(result).toEqual([{ id: '1' }, { id: '2' }])
  })

  it('should use legacy project when no project ID provided', async () => {
    fetchMock.mockResponse(JSON.stringify({ items: [{ id: '1' }] }))

    await addGroceryItems([
      { name: 'Milk', quantity: 5, unit: GroceryItemUnit.LITER, shopId: 'shop-1', imagePath: '/assets/icons/milk.png' },
    ])

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Project-ID': 'legacy-shared-project',
        }),
      })
    )
  })

  describe('When the API call fails', () => {
    it('should throw an error', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'API call failed' }), { status: 500 })

      await expect(addGroceryItems([
        { name: 'Milk', quantity: 5, unit: GroceryItemUnit.LITER, shopId: 'shop-1', imagePath: '/assets/icons/milk.png' },
      ])).rejects.toThrow('Failed to add grocery items')
    })
  })

  describe('When the response does not contain items array', () => {
    it('should throw an error', async () => {
      fetchMock.mockResponse(JSON.stringify({ id: '1' }), { status: 200 })

      await expect(addGroceryItems([
        { name: 'Milk', quantity: 5, unit: GroceryItemUnit.LITER, shopId: 'shop-1', imagePath: '/assets/icons/milk.png' },
      ])).rejects.toThrow('Unexpected response from API')
    })
  })
})

describe('Given the addGroceryItem function (single-item wrapper)', () => {
  it('should wrap the item in an array and return a single item', async () => {
    fetchMock.mockResponse(JSON.stringify({ items: [{ id: '1' }] }))

    const result = await addGroceryItem({
      name: 'Milk',
      quantity: 5,
      unit: GroceryItemUnit.LITER,
      shopId: 'shop-1',
      imagePath: '/assets/icons/milk.png',
    }, 'test-project-id')

    expect(result).toEqual(expect.objectContaining({ id: '1', name: 'Milk' }))
    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: JSON.stringify({
          items: [{ name: 'Milk', quantity: 5, unit: GroceryItemUnit.LITER, shopId: 'shop-1', imagePath: '/assets/icons/milk.png' }],
        }),
      })
    )
  })
})
