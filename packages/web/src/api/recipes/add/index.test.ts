import { addRecipe } from '.'
import { FetchMock } from 'jest-fetch-mock'
import { GroceryItemUnit } from '../../../enums/groceryItem'

const fetchMock = fetch as FetchMock

const exampleRecipe = {
  name: 'Pasta Carbonara',
  ingredients: [
    { name: 'Pasta', quantity: 200, unit: GroceryItemUnit.GRAM },
    { name: 'Eggs', quantity: 2, unit: GroceryItemUnit.UNIT },
  ],
  instructions: ['Boil pasta', 'Mix eggs'],
  imagePath: '/assets/images/pasta.png',
  externalLink: 'https://example.com/pasta',
}

const exampleResponse = {
  id: 'recipe-1',
  ...exampleRecipe,
}

describe('Given the addRecipe function', () => {
  it('should make the correct request to the API with legacy project when no project ID provided', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse))

    await addRecipe(exampleRecipe)

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/recipes',
      {
        method: 'PUT',
        body: JSON.stringify(exampleRecipe),
        headers: {
          'X-Project-ID': 'legacy-shared-project',
          'Content-Type': 'application/json',
        },
      }
    )
  })

  it('should make the correct request to the API with provided project ID', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse))

    await addRecipe(exampleRecipe, 'test-project-id')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/recipes',
      {
        method: 'PUT',
        body: JSON.stringify(exampleRecipe),
        headers: {
          'X-Project-ID': 'test-project-id',
          'Content-Type': 'application/json',
        },
      }
    )
  })

  it('should return the created recipe', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse))

    const result = await addRecipe(exampleRecipe)

    expect(result).toEqual(exampleResponse)
  })

  describe('When the API call fails', () => {
    it('should throw an error', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'fail' }), { status: 500 })

      await expect(addRecipe(exampleRecipe)).rejects.toThrow('Failed to add recipe')
    })
  })

  describe('When the returned data does not contain an id', () => {
    it('should throw an error', async () => {
      fetchMock.mockResponse(JSON.stringify({ name: 'Pasta Carbonara' }), { status: 200 })

      await expect(addRecipe(exampleRecipe)).rejects.toThrow('Unexpected response from API')
    })
  })
})
