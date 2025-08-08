import { act, render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { AppStateProvider, initialState } from '../../providers/AppStateProvider'
import theme from '../../theme'
import { BrowserRouter } from 'react-router'
import GroceryListRoute from '.'
import * as API from '../../api/groceryList'
import { GroceryItemUnit } from '../../enums/groceryItem'
import { useAppState } from '../../providers/AppStateProvider'

jest.mock('../../providers/AppStateProvider', () => ({
  ...jest.requireActual('../../providers/AppStateProvider'),
  useAppState: jest.fn(),
}))

jest.mock('../../api/groceryList')
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(() => jest.fn()),
}))

describe('Given the GroceryListRoute component', () => {
  it('should have the correct title', async () => {
    jest.spyOn(API, 'retrieveGroceryList').mockResolvedValue([])

    await act(async () => {
      renderComponent()
    })

    expect(screen.getByText('Grocery List')).toBeVisible()
  })

  it('should retrieve the grocery list', async () => {
    const groceryListSpy = jest.spyOn(API, 'retrieveGroceryList').mockResolvedValue([])

    await act(async () => {
      renderComponent()
    })

    expect(groceryListSpy).toHaveBeenCalled()
  })

  it('should display the grocery list', async () => {
    const mockGroceryList = [
      { id: '1', name: 'Milk', quantity: 1, unit: GroceryItemUnit.LITER, imagePath: 'https://hostname.com/image.png' },
      { id: '2', name: 'Bread', quantity: 2, unit: GroceryItemUnit.UNIT, imagePath: 'https://hostname.com/image.png' },
    ]

    jest.spyOn(API, 'retrieveGroceryList').mockResolvedValue(mockGroceryList)

    await act(async () => {
      renderComponent()
    })

    await waitFor(() => {
      expect(screen.getByText('Milk')).toBeVisible()
      expect(screen.getByText('Bread')).toBeVisible()
    })
  })

  describe('When the fetch fails', () => {
    it('should display an error message', async () => {
      const errorSpy = jest.spyOn(console, 'error')

      jest.spyOn(API, 'retrieveGroceryList').mockRejectedValue(new Error('Bad things happen all the time'))

      await act(async () => {
        renderComponent()
      })

      expect(errorSpy).toHaveBeenCalledWith('Failed to fetch grocery list:', new Error('Bad things happen all the time'))
    })
  })
})

const renderComponent = () => {
  jest.mocked(useAppState).mockReturnValue({
    state: {
      ...initialState,
    },
    dispatch: jest.fn(),
  })

  render(
    <ThemeProvider theme={theme}>
      <AppStateProvider>
        <BrowserRouter>
          <GroceryListRoute />
        </BrowserRouter>
      </AppStateProvider>
    </ThemeProvider>
  )
}
