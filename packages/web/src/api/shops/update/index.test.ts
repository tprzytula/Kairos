import { updateShop } from '.'
import { FetchMock } from 'jest-fetch-mock'
import { IUpdateShopRequestBody } from '../types'

const fetchMock = fetch as FetchMock

const exampleUpdateData: IUpdateShopRequestBody = {
  id: 'shop-123',
  name: 'Updated Shop Name',
  icon: '/assets/icons/updated-shop.png'
}

describe('Given the updateShop function', () => {
  it('should make the correct request to the API with legacy project when no project ID provided', async () => {
    fetchMock.mockResponse(JSON.stringify({}))

    await updateShop(exampleUpdateData)

    expect(fetchMock).toHaveBeenCalledWith(
      `https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/shops/${exampleUpdateData.id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(exampleUpdateData),
        headers: {
          'X-Project-ID': 'legacy-shared-project',
          'Content-Type': 'application/json',
        },
      }
    )
  })

  it('should make the correct request to the API with provided project ID', async () => {
    fetchMock.mockResponse(JSON.stringify({}))

    await updateShop(exampleUpdateData, 'test-project-id')

    expect(fetchMock).toHaveBeenCalledWith(
      `https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/shops/${exampleUpdateData.id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(exampleUpdateData),
        headers: {
          'X-Project-ID': 'test-project-id',
          'Content-Type': 'application/json',
        },
      }
    )
  })

  it('should make the correct request with partial update data', async () => {
    fetchMock.mockResponse(JSON.stringify({}))

    const partialUpdateData: IUpdateShopRequestBody = {
      id: 'shop-123',
      name: 'Just Name Update'
    }

    await updateShop(partialUpdateData)

    expect(fetchMock).toHaveBeenCalledWith(
      `https://269ovkdwmf.execute-api.eu-west-2.amazonaws.com/v1/shops/${partialUpdateData.id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(partialUpdateData),
        headers: {
          'X-Project-ID': 'legacy-shared-project',
          'Content-Type': 'application/json',
        },
      }
    )
  })

  describe('When the API call fails', () => {
    it('should throw an error', async () => {
      fetchMock.mockResponse(JSON.stringify({ error: 'API call failed' }), {
        status: 500,
      })

      await expect(updateShop(exampleUpdateData)).rejects.toThrow('Failed to update shop')
    })
  })
})
