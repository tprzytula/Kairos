import { act, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { AppStateProvider } from '../../providers/AppStateProvider'
import theme from '../../theme'
import { BrowserRouter } from 'react-router'
import AddGroceryItem from '.'
import * as ReactRouter from 'react-router'

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
}))

describe('Given the AddGroceryItem component', () => {
  it('should have the correct title', () => {
    renderComponent()
    expect(screen.getByText('Add Grocery Item')).toBeVisible()
  })

  describe('When the back button is clicked', () => {
    it('should navigate back to the grocery list page', async () => {
      const navigateSpy = jest.fn()

      jest.spyOn(ReactRouter, 'useNavigate').mockReturnValue(navigateSpy)

      renderComponent()

      await act(async () => {
        screen.getByLabelText('Back Button').click()
      })

      expect(navigateSpy).toHaveBeenCalledWith('/groceries')
    })
  })
})

const renderComponent = () => {
  render(
    <ThemeProvider theme={theme}>
      <AppStateProvider>
        <BrowserRouter>
          <AddGroceryItem />
        </BrowserRouter>
      </AppStateProvider>
    </ThemeProvider>
  )
}