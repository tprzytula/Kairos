import { render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { AppStateProvider } from '../../providers/AppStateProvider'
import theme from '../../theme'
import { BrowserRouter } from 'react-router'
import GroceryList from '.'
import * as API from '../../api'


jest.mock('../../api')

const renderComponent = () => {
  render(
    <ThemeProvider theme={theme}>
      <AppStateProvider>
        <BrowserRouter>
          <GroceryList />
        </BrowserRouter>
      </AppStateProvider>
    </ThemeProvider>
  )
}

describe('Given the GroceryList component', () => {
  it('should have the correct title', () => {
    renderComponent()
    expect(screen.getByText('Grocery List')).toBeVisible()
  })

  it('should retrieve the grocery list', () => {
    const groceryListSpy = jest.spyOn(API, 'retrieveGroceryList')

    renderComponent()

    expect(groceryListSpy).toHaveBeenCalled()
  })

  it('should display the grocery list', async () => {
    const mockGroceryList = [
      { id: '1', name: 'Milk', quantity: 1 },
      { id: '2', name: 'Bread', quantity: 2 },
    ]

    jest.spyOn(API, 'retrieveGroceryList').mockResolvedValue(mockGroceryList)

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Milk')).toBeVisible()
      expect(screen.getByText('Bread')).toBeVisible()
    })
  })
})
