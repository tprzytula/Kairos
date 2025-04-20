import { act, render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { AppStateProvider } from '../../providers/AppStateProvider'
import theme from '../../theme'
import { BrowserRouter } from 'react-router'
import GroceryListRoute from '.'
import * as API from '../../api/groceryList'
import * as ReactRouter from 'react-router'
import { GroceryItemUnit } from '../../enums/groceryItem'

jest.mock('../../api/groceryList')
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
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

  describe('When the add item button is clicked', () => {
    it('should navigate to the add item page', async () => {
      const navigateSpy = jest.fn()

      jest.spyOn(ReactRouter, 'useNavigate').mockReturnValue(navigateSpy)
      jest.spyOn(API, 'retrieveGroceryList').mockResolvedValue([])

      await act(async () => {
        renderComponent()
      })

      await act(async () => { 
        screen.getByLabelText('Navigate to route').click()
      })

      expect(navigateSpy).toHaveBeenCalledWith('/groceries/add')
    })
  })

  describe('When the back button is clicked', () => {
    it('should navigate back to the grocery list page', async () => {
      const navigateSpy = jest.fn()

      jest.spyOn(ReactRouter, 'useNavigate').mockReturnValue(navigateSpy)
      jest.spyOn(API, 'retrieveGroceryList').mockResolvedValue([])

      await act(async () => {
        renderComponent()
      })

      await act(async () => {
        screen.getByLabelText('Back Button').click()
      })

      expect(navigateSpy).toHaveBeenCalledWith('/')
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
