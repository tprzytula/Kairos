import { addShop } from '.'
import { FetchMock } from 'jest-fetch-mock'
import { ICreateShopRequestBody } from '../types'

const fetchMock = fetch as FetchMock

const exampleShopData: ICreateShopRequestBody = {
  name: 'Test Shop',
  icon: '/assets/icons/shop.png'
}

const exampleResponse = {
  id: 'shop-123'
}

describe('Given the addShop function', () => {
  it('should make the correct request to the API with legacy project when no project ID provided', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse))

    await addShop(exampleShopData)

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/shops',
      {
        method: 'PUT',
        body: JSON.stringify(exampleShopData),
        headers: {
          'X-Project-ID': 'legacy-shared-project',
          'Content-Type': 'application/json',
        },
      }
    )
  })

  it('should make the correct request to the API with provided project ID', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse))

    await addShop(exampleShopData, 'test-project-id')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/shops',
      {
        method: 'PUT',
        body: JSON.stringify(exampleShopData),
        headers: {
          'X-Project-ID': 'test-project-id',
          'Content-Type': 'application/json',
        },
      }
    )
  })

  it('should return the created shop id on success', async () => {
    fetchMock.mockResponse(JSON.stringify(exampleResponse))

    const result = await addShop(exampleShopData)

    expect(result).toStrictEqual(exampleResponse)
  })

  describe('When the shop name already exists', () => {
    it('should throw a specific error', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'Shop name already exists' }), {
        status: 409,
      })

      await expect(addShop(exampleShopData)).rejects.toThrow('Shop name already exists')
    })
  })

  describe('When the API call fails', () => {
    it('should throw an error', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'API call failed' }), {
        status: 500,
      })

      await expect(addShop(exampleShopData)).rejects.toThrow('Failed to add shop')
    })
  })
})
