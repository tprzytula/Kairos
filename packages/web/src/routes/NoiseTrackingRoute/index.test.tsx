import { act, render, screen, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { AppStateProvider, initialState } from '../../providers/AppStateProvider'
import theme from '../../theme'
import { BrowserRouter } from 'react-router'
import NoiseTrackingRoute from '.'
import * as API from '../../api/noiseTracking'
import { useAppState } from '../../providers/AppStateProvider'

jest.mock('../../providers/AppStateProvider', () => ({
  ...jest.requireActual('../../providers/AppStateProvider'),
  useAppState: jest.fn(),
}))

jest.mock('../../api/noiseTracking')

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
      { timestamp: 1714028400000 }, // 25 Apr 2024, 07:00 (7am)
      { timestamp: 1724003200001 }, // 18 Aug 2024, 18:46 (6:46 PM)
    ]

    jest.spyOn(API, 'retrieveNoiseTrackingItems').mockResolvedValue(mockNoiseTrackingItems)

    await act(async () => {
      renderComponent()
    })

    await waitFor(() => {
      // Check that the date groups are shown
      expect(screen.getByText('25 April 2024 • Thursday')).toBeVisible()
      expect(screen.getByText('18 August 2024 • Sunday')).toBeVisible()
      
      // Check individual timestamps - they should be visible since items auto-expand
      const firstTimestamp = screen.getAllByText('25 Apr 2024, 08:00')
      const secondTimestamp = screen.getAllByText('18 Aug 2024, 18:46')
      expect(firstTimestamp.length).toBeGreaterThan(0)
      expect(secondTimestamp.length).toBeGreaterThan(0)
      expect(firstTimestamp[0]).toBeVisible()
      expect(secondTimestamp[0]).toBeVisible()
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
})

const renderComponent = () => {
  jest.mocked(useAppState).mockReturnValue({
    state: initialState,
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
