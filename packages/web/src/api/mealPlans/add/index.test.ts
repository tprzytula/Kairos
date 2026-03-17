import { addMealPlan } from '.'
import { FetchMock } from 'jest-fetch-mock'

const fetchMock = fetch as FetchMock

const exampleMealPlan = {
  date: '2026-03-17',
  recipeName: 'Pasta',
  recipeId: 'recipe-1',
  mealType: 'dinner',
}

const exampleResponse = {
  id: 'meal-plan-1',
  date: '2026-03-17',
  recipeName: 'Pasta',
  recipeId: 'recipe-1',
  mealType: 'dinner',
}

describe('Given the addMealPlan function', () => {
  it('should make the correct request to the API with legacy project when no project ID provided', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse))

    await addMealPlan(exampleMealPlan)

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/meal-plans',
      {
        method: 'PUT',
        body: JSON.stringify(exampleMealPlan),
        headers: {
          'X-Project-ID': 'legacy-shared-project',
          'Content-Type': 'application/json',
        },
      }
    )
  })

  it('should make the correct request to the API with provided project ID', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse))

    await addMealPlan(exampleMealPlan, 'test-project-id')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/meal-plans',
      {
        method: 'PUT',
        body: JSON.stringify(exampleMealPlan),
        headers: {
          'X-Project-ID': 'test-project-id',
          'Content-Type': 'application/json',
        },
      }
    )
  })

  it('should return the created meal plan', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse))

    const result = await addMealPlan(exampleMealPlan)

    expect(result).toStrictEqual(exampleResponse)
  })

  describe('When the API call fails', () => {
    it('should throw an error', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'fail' }), { status: 500 })

      await expect(addMealPlan(exampleMealPlan)).rejects.toThrow('Failed to add meal plan')
    })
  })

  describe('When the returned data does not contain an id', () => {
    it('should throw an error', async () => {
      fetchMock.mockResponse(JSON.stringify({ date: '2026-03-17', recipeName: 'Pasta' }), { status: 200 })

      await expect(addMealPlan(exampleMealPlan)).rejects.toThrow('Unexpected response from API')
    })
  })
})
