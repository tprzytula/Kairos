import { getRecipeUploadUrl } from '.'
import { FetchMock } from 'jest-fetch-mock'

const fetchMock = fetch as FetchMock

const exampleResponse = {
  uploadUrl: 'https://s3.amazonaws.com/bucket/upload?signed=true',
  imagePath: '/assets/images/recipe-1.jpg',
}

describe('Given the getRecipeUploadUrl function', () => {
  it('should make the correct request to the API with encoded extension and legacy project when no project ID provided', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse))

    await getRecipeUploadUrl('jpg')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/recipes/upload-url?extension=jpg',
      {
        headers: {
          'X-Project-ID': 'legacy-shared-project',
          'Content-Type': 'application/json',
        },
      }
    )
  })

  it('should make the correct request with png extension', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse))

    await getRecipeUploadUrl('png')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/recipes/upload-url?extension=png',
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

    await getRecipeUploadUrl('jpg', 'test-project-id')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/recipes/upload-url?extension=jpg',
      {
        headers: {
          'X-Project-ID': 'test-project-id',
          'Content-Type': 'application/json',
        },
      }
    )
  })

  it('should return the upload URL and image path', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse))

    const result = await getRecipeUploadUrl('jpg')

    expect(result).toStrictEqual(exampleResponse)
  })

  describe('When the API call fails', () => {
    it('should throw an error', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'fail' }), { status: 500 })

      await expect(getRecipeUploadUrl('jpg')).rejects.toThrow('Failed to get upload URL')
    })
  })
})
