import { updateMealPlan } from '.'
import { FetchMock } from 'jest-fetch-mock'

const fetchMock = fetch as FetchMock

const exampleId = 'meal-plan-1'
const exampleFields = {
  date: '2026-03-17',
  recipeName: 'Pasta',
  recipeId: 'recipe-1',
  mealType: 'dinner',
}

describe('Given the updateMealPlan function', () => {
  it('should make the correct request to the API with legacy project when no project ID provided', async () => {
    fetchMock.mockResponse(JSON.stringify({}), { status: 200 })

    await updateMealPlan(exampleId, exampleFields)

    expect(fetchMock).toHaveBeenCalledWith(
      `https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/meal-plans/${exampleId}`,
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

    await updateMealPlan(exampleId, exampleFields, 'test-project-id')

    expect(fetchMock).toHaveBeenCalledWith(
      `https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/meal-plans/${exampleId}`,
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

    await expect(updateMealPlan(exampleId, exampleFields)).resolves.not.toThrow()
  })

  describe('When the API call fails', () => {
    it('should throw an error', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'fail' }), { status: 500 })

      await expect(updateMealPlan(exampleId, exampleFields)).rejects.toThrow('Failed to update meal plan')
    })
  })
})
