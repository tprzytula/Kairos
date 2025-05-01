import { render, screen, renderHook, waitFor, act } from '@testing-library/react'
import { useGroceryListContext } from './index'
import { GroceryListProvider } from './index'
import * as API from '../../api'
import { GroceryItem } from '../AppStateProvider/types'
import { GroceryItemUnit } from '../../enums/groceryItem'

jest.mock('../../api')

describe('Given the GroceryListProvider component', () => {
  it('should render the component', async () => {
    await act(async () => {
      renderGroceryListProvider()
    })

    expect(screen.getByText('Test')).toBeVisible()
  })

  it('should make a request to the API', async () => {
    jest.spyOn(API, 'retrieveGroceryList').mockResolvedValue(EXAMPLE_GROCERY_LIST)

    await act(async () => {
      renderGroceryListProvider()
    })

    await waitFor(() => expect(API.retrieveGroceryList).toHaveBeenCalled())
  })

  describe('When the API request fails', () => {
    it('should log an error', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error')
      jest.spyOn(API, 'retrieveGroceryList').mockRejectedValue(new Error('It is what it is'))

      await act(async () => {
        renderGroceryListProvider()
      })

      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch grocery list:', new Error('It is what it is'))
    })
  })
})

describe('Given the useGroceryListContext hook', () => {
  it('should return the grocery list', async () => {
    jest.spyOn(API, 'retrieveGroceryList').mockResolvedValue(EXAMPLE_GROCERY_LIST)

    const { result } = await waitFor(() => renderHook(() => useGroceryListContext(), {
      wrapper: GroceryListProvider,
    }))

    await waitFor(() => {
      expect(result.current.groceryList).toStrictEqual(EXAMPLE_GROCERY_LIST)
    })
  })

  describe('When the API request fails', () => {
    it('should return an empty array', async () => {
      jest.spyOn(API, 'retrieveGroceryList').mockRejectedValue(new Error('It is what it is'))

      const { result } = await waitFor(() => renderHook(() => useGroceryListContext(), {
        wrapper: GroceryListProvider,
      }))

      await waitFor(() => {
        expect(result.current.groceryList).toStrictEqual([])
      })
    })
  })
})

const EXAMPLE_GROCERY_LIST: Array<GroceryItem> = [
  {
      id: '1',
      name: 'Milk',
      quantity: 5,
      imagePath: 'https://hostname.com/image.png',
      unit: GroceryItemUnit.LITER,
    },
    {
      id: '2',
      name: 'Bread',
      quantity: 2,
      imagePath: 'https://hostname.com/image.png',
      unit: GroceryItemUnit.UNIT,
    },
]

const renderGroceryListProvider = () => {
  return render(
    <GroceryListProvider>
      <div>Test</div>
    </GroceryListProvider>
  )
}