import { act, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { AppStateProvider, initialState } from '../../providers/AppStateProvider'
import theme from '../../theme'
import { BrowserRouter } from 'react-router'
import NoiseTrackingRoute from '.'
import * as ReactRouter from 'react-router'
import { useAppState } from '../../providers/AppStateProvider'

jest.mock('../../providers/AppStateProvider', () => ({
  ...jest.requireActual('../../providers/AppStateProvider'),
  useAppState: jest.fn(),
}))

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
}))

describe('Given the NoiseTrackingRoute component', () => {
  it('should have the correct title', async () => {
    await act(async () => {
      renderComponent()
    })

    expect(screen.getByText('To Do List')).toBeVisible()
  })

  describe('When the back button is clicked', () => {
    it('should navigate back to the home page', async () => {
      const navigateSpy = jest.fn()

      jest.spyOn(ReactRouter, 'useNavigate').mockReturnValue(navigateSpy)

      await act(async () => {
        renderComponent()
      })

      await act(async () => {
        screen.getByLabelText('Back Button').click()
      })

      expect(navigateSpy).toHaveBeenCalledWith('/')
    })
  })

  describe('When the skip starting screen is true', () => {
    it('should not display the back button', async () => {
      await act(async () => {
        renderComponent({ skipStartingScreen: true })
      })

      expect(screen.queryByLabelText('Back Button')).not.toBeVisible()
    })
  })
})

interface IRenderComponentProps {
  skipStartingScreen?: boolean
}

const renderComponent = ({ skipStartingScreen = false }: IRenderComponentProps = {}) => {
  jest.mocked(useAppState).mockReturnValue({
    state: {
      ...initialState,
      skipStartingScreen,
    },
    dispatch: jest.fn(),
  })

  render(
    <ThemeProvider theme={theme}>
      <AppStateProvider>
        <BrowserRouter>
          <NoiseTrackingRoute />
        </BrowserRouter>
      </AppStateProvider>
    </ThemeProvider>
  )
}
