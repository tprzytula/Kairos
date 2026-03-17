import { updateRecipe } from '.'
import { FetchMock } from 'jest-fetch-mock'
import { GroceryItemUnit } from '../../../enums/groceryItem'

const fetchMock = fetch as FetchMock

const exampleId = 'recipe-1'
const exampleFields = {
  name: 'Pasta Carbonara',
  ingredients: [
    { name: 'Pasta', quantity: 200, unit: GroceryItemUnit.GRAM },
    { name: 'Eggs', quantity: 2, unit: GroceryItemUnit.UNIT },
  ],
  instructions: ['Boil pasta', 'Mix eggs'],
  imagePath: '/assets/images/pasta.png',
  externalLink: 'https://example.com/pasta',
}

describe('Given the updateRecipe function', () => {
  it('should make the correct request to the API with legacy project when no project ID provided', async () => {
    fetchMock.mockResponse(JSON.stringify({}), { status: 200 })

    await updateRecipe(exampleId, exampleFields)

    expect(fetchMock).toHaveBeenCalledWith(
      `https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/recipes/${exampleId}`,
      {
        method: 'POST',
        body: JSON.stringify({ id: exampleId, ...exampleFields }),
        headers: {
          'X-Project-ID': 'legacy-shared-project',
          'Content-Type': 'application/json',
        },
      }
    )
  })

  it('should make the correct request to the API with provided project ID', async () => {
    fetchMock.mockResponse(JSON.stringify({}), { status: 200 })

    await updateRecipe(exampleId, exampleFields, 'test-project-id')

    expect(fetchMock).toHaveBeenCalledWith(
      `https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/recipes/${exampleId}`,
      {
        method: 'POST',
        body: JSON.stringify({ id: exampleId, ...exampleFields }),
        headers: {
          'X-Project-ID': 'test-project-id',
          'Content-Type': 'application/json',
        },
      }
    )
  })

  it('should resolve without error on success', async () => {
    fetchMock.mockResponse(JSON.stringify({}), { status: 200 })

    await expect(updateRecipe(exampleId, exampleFields)).resolves.not.toThrow()
  })

  describe('When the API call fails', () => {
    it('should throw an error', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'fail' }), { status: 500 })

      await expect(updateRecipe(exampleId, exampleFields)).rejects.toThrow('Failed to update recipe')
    })
  })
})
