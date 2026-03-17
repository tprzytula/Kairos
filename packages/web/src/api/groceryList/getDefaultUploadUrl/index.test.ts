import { getGroceryDefaultUploadUrl } from '.'
import { FetchMock } from 'jest-fetch-mock'

const fetchMock = fetch as FetchMock

const exampleResponse = {
  uploadUrl: 'https://s3.amazonaws.com/bucket/upload?signed=true',
  imagePath: '/assets/images/grocery-item-1.jpg',
}

describe('Given the getGroceryDefaultUploadUrl function', () => {
  it('should make the correct request to the API with encoded extension and legacy project when no project ID provided', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse))

    await getGroceryDefaultUploadUrl('jpg')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/grocery_list/items_defaults/upload-url?extension=jpg',
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

    await getGroceryDefaultUploadUrl('png')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/grocery_list/items_defaults/upload-url?extension=png',
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

    await getGroceryDefaultUploadUrl('jpg', 'test-project-id')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/grocery_list/items_defaults/upload-url?extension=jpg',
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

    const result = await getGroceryDefaultUploadUrl('jpg')

    expect(result).toStrictEqual(exampleResponse)
  })

  describe('When the API call fails', () => {
    it('should throw an error', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'fail' }), { status: 500 })

      await expect(getGroceryDefaultUploadUrl('jpg')).rejects.toThrow('Failed to get upload URL')
    })
  })
})
