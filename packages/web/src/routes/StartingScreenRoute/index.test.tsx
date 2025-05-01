import { render, screen, act } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { AppStateProvider } from '../../providers/AppStateProvider'
import theme from '../../theme'
import { BrowserRouter } from 'react-router'
import StartingScreenRoute from '.'
import * as ReactRouter from 'react-router'

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
}))

describe('Given the StartingScreenRoute component', () => {
  it('should have the correct title', () => {
    renderComponent()
    expect(screen.getByText('Kairos')).toBeVisible()
  })

  it('should have a grocery list button', () => {
    renderComponent()
    expect(screen.getByText('Grocery List')).toBeVisible()
  })
  
  describe('When the grocery list button is clicked', () => {
    it('should navigate to the grocery list page', async () => {
      const navigateSpy = jest.fn()

      jest.spyOn(ReactRouter, 'useNavigate').mockReturnValue(navigateSpy)

      renderComponent()

      await act(async () => {
        screen.getByText('Grocery List').click()
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
          <StartingScreenRoute />
        </BrowserRouter>
      </AppStateProvider>
    </ThemeProvider>
  )
}