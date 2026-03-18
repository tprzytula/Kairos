import { updateGroceryItemDefault } from '.'
import { FetchMock } from 'jest-fetch-mock'
import { GroceryItemUnit } from '../../../enums/groceryItem'

const fetchMock = fetch as FetchMock

const exampleName = 'Olive Oil'
const examplePayload = {
  icon: '/assets/icons/olive-oil.png',
  unit: GroceryItemUnit.MILLILITER,
  category: 'condiments',
}

describe('Given the updateGroceryItemDefault function', () => {
  it('should make the correct request to the API with encoded name and legacy project when no project ID provided', async () => {
    fetchMock.mockResponse(JSON.stringify({}), { status: 200 })

    await updateGroceryItemDefault(exampleName, examplePayload)

    expect(fetchMock).toHaveBeenCalledWith(
      `https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/grocery_list/items_defaults/${encodeURIComponent(exampleName)}`,
      {
        method: 'PATCH',
        body: JSON.stringify(examplePayload),
        headers: {
          'X-Project-ID': 'legacy-shared-project',
          'Content-Type': 'application/json',
        },
      }
    )
  })

  it('should correctly encode the name in the URL', async () => {
    fetchMock.mockResponse(JSON.stringify({}), { status: 200 })

    await updateGroceryItemDefault('Olive Oil', examplePayload)

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/grocery_list/items_defaults/Olive%20Oil',
      expect.any(Object)
    )
  })

  it('should make the correct request to the API with provided project ID', async () => {
    fetchMock.mockResponse(JSON.stringify({}), { status: 200 })

    await updateGroceryItemDefault(exampleName, examplePayload, 'test-project-id')

    expect(fetchMock).toHaveBeenCalledWith(
      `https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/grocery_list/items_defaults/${encodeURIComponent(exampleName)}`,
      {
        method: 'PATCH',
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

    await expect(updateGroceryItemDefault(exampleName, examplePayload)).resolves.toBeUndefined()
  })

  describe('When the API call fails', () => {
    it('should throw an error', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'fail' }), { status: 500 })

      await expect(updateGroceryItemDefault(exampleName, examplePayload)).rejects.toThrow('Failed to update grocery item default')
    })
  })
})
