import { addBirthday } from '.'
import { FetchMock } from 'jest-fetch-mock'

const fetchMock = fetch as FetchMock

const exampleBirthday = {
  name: 'Alice',
  day: 15,
  month: 3,
}

const exampleResponse = {
  id: 'birthday-1',
  ...exampleBirthday,
}

describe('Given the addBirthday function', () => {
  it('should make the correct request to the API with legacy project when no project ID provided', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse))

    await addBirthday(exampleBirthday)

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/birthdays/items',
      {
        method: 'PUT',
        body: JSON.stringify(exampleBirthday),
        headers: {
          'X-Project-ID': 'legacy-shared-project',
          'Content-Type': 'application/json',
        },
      }
    )
  })

  it('should make the correct request to the API with provided project ID', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse))

    await addBirthday(exampleBirthday, 'test-project-id')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/birthdays/items',
      {
        method: 'PUT',
        body: JSON.stringify(exampleBirthday),
        headers: {
          'X-Project-ID': 'test-project-id',
          'Content-Type': 'application/json',
        },
      }
    )
  })

  it('should return the created birthday item', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse))

    const result = await addBirthday(exampleBirthday)

    expect(result).toEqual(exampleResponse)
  })

  describe('When the API call fails', () => {
    it('should throw an error', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'fail' }), { status: 500 })

      await expect(addBirthday(exampleBirthday)).rejects.toThrow('Failed to add birthday')
    })
  })

  describe('When the returned data does not contain an id', () => {
    it('should throw an error', async () => {
      fetchMock.mockResponse(JSON.stringify({ name: 'Alice', day: 15, month: 3 }), { status: 200 })

      await expect(addBirthday(exampleBirthday)).rejects.toThrow('Unexpected response from API')
    })
  })
})
