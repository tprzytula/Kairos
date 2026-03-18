import { addGroceryItemDefault } from '.'
import { FetchMock } from 'jest-fetch-mock'
import { GroceryItemUnit } from '../../../enums/groceryItem'

const fetchMock = fetch as FetchMock

const examplePayload = {
  name: 'Olive Oil',
  icon: '/assets/icons/olive-oil.png',
  unit: GroceryItemUnit.MILLILITER,
  category: 'condiments',
}

describe('Given the addGroceryItemDefault function', () => {
  it('should make the correct request to the API with legacy project when no project ID provided', async () => {
    fetchMock.mockResponse(JSON.stringify({}), { status: 200 })

    await addGroceryItemDefault(examplePayload)

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/grocery_list/items_defaults',
      {
        method: 'POST',
        body: JSON.stringify(examplePayload),
        headers: {
          'X-Project-ID': 'legacy-shared-project',
          'Content-Type': 'application/json',
        },
      }
    )
  })

  it('should make the correct request to the API with provided project ID', async () => {
    fetchMock.mockResponse(JSON.stringify({}), { status: 200 })

    await addGroceryItemDefault(examplePayload, 'test-project-id')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/grocery_list/items_defaults',
      {
        method: 'POST',
        body: JSON.stringify(examplePayload),
        headers: {
          'X-Project-ID': 'test-project-id',
          'Content-Type': 'application/json',
        },
      }
    )
  })

  it('should resolve without error on success', async () => {
    fetchMock.mockResponse(JSON.stringify({}), { status: 200 })

    await expect(addGroceryItemDefault(examplePayload)).resolves.toBeUndefined()
  })

  describe('When the API call fails', () => {
    it('should throw an error', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'fail' }), { status: 500 })

      await expect(addGroceryItemDefault(examplePayload)).rejects.toThrow('Failed to add grocery item default')
    })
  })
})
