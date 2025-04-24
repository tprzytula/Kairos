import { act, render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { AppStateProvider, initialState } from '../../providers/AppStateProvider'
import theme from '../../theme'
import { BrowserRouter } from 'react-router'
import NoiseTrackingRoute from '.'
import * as API from '../../api/noiseTracking'
import * as ReactRouter from 'react-router'
import { useAppState } from '../../providers/AppStateProvider'

jest.mock('../../providers/AppStateProvider', () => ({
  ...jest.requireActual('../../providers/AppStateProvider'),
  useAppState: jest.fn(),
}))

jest.mock('../../api/noiseTracking')
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
}))

describe('Given the NoiseTrackingRoute component', () => {
  it('should have the correct title', async () => {
    jest.spyOn(API, 'retrieveNoiseTrackingItems').mockResolvedValue([])

    await act(async () => {
      renderComponent()
    })

    expect(screen.getByText('Noise Tracking')).toBeVisible()
  })

  it('should retrieve the noise tracking items', async () => {
    const noiseTrackingItemsSpy = jest.spyOn(API, 'retrieveNoiseTrackingItems').mockResolvedValue([])

    await act(async () => {
      renderComponent()
    })

    expect(noiseTrackingItemsSpy).toHaveBeenCalled()
  })

  it('should display the noise tracking items', async () => {
    const mockNoiseTrackingItems = [
      { timestamp: 1714003200000 },
      { timestamp: 1724003200001 },
    ]

    jest.spyOn(API, 'retrieveNoiseTrackingItems').mockResolvedValue(mockNoiseTrackingItems)

    await act(async () => {
      renderComponent()
    })

    await waitFor(() => {
      expect(screen.getByText('25 April 2024 at 01:00')).toBeVisible()
      expect(screen.getByText('18 August 2024 at 18:46')).toBeVisible()
    })
  })

  describe('When the back button is clicked', () => {
    it('should navigate back to the grocery list page', async () => {
      const navigateSpy = jest.fn()

      jest.spyOn(ReactRouter, 'useNavigate').mockReturnValue(navigateSpy)
      jest.spyOn(API, 'retrieveNoiseTrackingItems').mockResolvedValue([])

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

      jest.spyOn(API, 'retrieveNoiseTrackingItems').mockRejectedValue(new Error('Bad things happen all the time'))

      await act(async () => {
        renderComponent()
      })

      expect(errorSpy).toHaveBeenCalledWith('Failed to fetch noise tracking items:', new Error('Bad things happen all the time'))
    })
  })

  describe('When the skip starting screen is true', () => {
    it('should not display the back button', async () => {
      jest.spyOn(API, 'retrieveNoiseTrackingItems').mockResolvedValue([])

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
