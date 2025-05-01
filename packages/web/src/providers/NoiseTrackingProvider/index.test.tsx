import { render, screen, renderHook, waitFor, act } from '@testing-library/react'
import * as API from '../../api/noiseTracking'
import { INoiseTrackingItem } from '../../api/noiseTracking'
import { NoiseTrackingProvider, useNoiseTrackingContext } from './index'

jest.mock('../../api/noiseTracking')

describe('Given the NoiseTrackingProvider component', () => {
  it('should render the component', async () => {
    await act(async () => {
      renderNoiseTrackingProvider()
    })

    expect(screen.getByText('Test')).toBeVisible()
  })

  it('should make a request to the API', async () => {
    jest.spyOn(API, 'retrieveNoiseTrackingItems').mockResolvedValue(EXAMPLE_NOISE_TRACKING_ITEMS)

    await act(async () => {
      renderNoiseTrackingProvider()
    })

    await waitFor(() => expect(API.retrieveNoiseTrackingItems).toHaveBeenCalled())
  })

  describe('When the API request fails', () => {
    it('should log an error', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error')
      jest.spyOn(API, 'retrieveNoiseTrackingItems').mockRejectedValue(new Error('It is what it is'))

      await act(async () => {
        renderNoiseTrackingProvider()
      })

      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch noise tracking items:', new Error('It is what it is'))
    })
  })
})

describe('Given the useGroceryListContext hook', () => {
  it('should return the noise tracking items', async () => {
      jest.spyOn(API, 'retrieveNoiseTrackingItems').mockResolvedValue(EXAMPLE_NOISE_TRACKING_ITEMS)

    const { result } = await waitFor(() => renderHook(() => useNoiseTrackingContext(), {
      wrapper: NoiseTrackingProvider,
    }))

    await waitFor(() => {
      expect(result.current.noiseTrackingItems).toStrictEqual(EXAMPLE_NOISE_TRACKING_ITEMS)
    })
  })

  it('should allow you to refetch the noise tracking items', async () => {
    jest.spyOn(API, 'retrieveNoiseTrackingItems').mockResolvedValue(EXAMPLE_NOISE_TRACKING_ITEMS)

    const { result } = await waitFor(() => renderHook(() => useNoiseTrackingContext(), {
      wrapper: NoiseTrackingProvider,
    }))

    await waitFor(() => {
      expect(result.current.noiseTrackingItems).toStrictEqual(EXAMPLE_NOISE_TRACKING_ITEMS)
    })

    jest.spyOn(API, 'retrieveNoiseTrackingItems').mockResolvedValue([
      {
        timestamp: 1714003200000,
      },
    ])

    await act(async () => {
      await result.current.refetchNoiseTrackingItems()
    })

    await waitFor(() => {
      expect(result.current.noiseTrackingItems).toStrictEqual([
        {
          timestamp: 1714003200000,
        },
      ])
    })
  })

  describe('When the API request fails', () => {
    it('should return an empty array', async () => {
      jest.spyOn(API, 'retrieveNoiseTrackingItems').mockRejectedValue(new Error('It is what it is'))

      const { result } = await waitFor(() => renderHook(() => useNoiseTrackingContext(), {
        wrapper: NoiseTrackingProvider,
      }))

      await waitFor(() => {
        expect(result.current.noiseTrackingItems).toStrictEqual([])
      })
    })
  })
})

const EXAMPLE_NOISE_TRACKING_ITEMS: Array<INoiseTrackingItem> = [
  {
    timestamp: 1714003200000,
    },
    {
      timestamp: 1714003200000,
    },
]

const renderNoiseTrackingProvider = () => {
  return render(
    <NoiseTrackingProvider>
      <div>Test</div>
    </NoiseTrackingProvider>
  )
}