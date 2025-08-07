import { render, screen } from "@testing-library/react"
import NoiseTrackingItem from "."
import * as NoiseTrackingProvider from "../../providers/NoiseTrackingProvider"

// Mock the provider
const mockRefetchNoiseTrackingItems = jest.fn()

jest.spyOn(NoiseTrackingProvider, 'useNoiseTrackingContext').mockReturnValue({
  noiseTrackingItems: [],
  isLoading: false,
  refetchNoiseTrackingItems: mockRefetchNoiseTrackingItems,
})

describe('Given the NoiseTrackingItem component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the noise tracking item with correct format', () => {
    render(<NoiseTrackingItem timestamp={1714003200000} />)

    // Updated format: day, month, year, time (appears twice - in absolute and relative sections)
    expect(screen.getAllByText('25 Apr 2024, 01:00')).toHaveLength(2)
    expect(screen.getByText('🌙')).toBeVisible() // Night time icon
  })

  it('should show relative time', () => {
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000)
    render(<NoiseTrackingItem timestamp={oneDayAgo} />)

    expect(screen.getByText('Yesterday')).toBeVisible()
  })

  it('should show delete button for items from today', () => {
    const now = Date.now()
    render(<NoiseTrackingItem timestamp={now} />)

    expect(screen.getByRole('button')).toBeVisible()
  })

  it('should not show delete button for items not from today', () => {
    const yesterday = Date.now() - (24 * 60 * 60 * 1000)
    render(<NoiseTrackingItem timestamp={yesterday} />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should show correct time of day icons', () => {
    // Morning: 6-12
    const morning = new Date()
    morning.setHours(9, 0, 0, 0)
    render(<NoiseTrackingItem timestamp={morning.getTime()} />)
    expect(screen.getByText('🌅')).toBeVisible()

    // Afternoon: 12-18
    const afternoon = new Date()
    afternoon.setHours(15, 0, 0, 0)
    render(<NoiseTrackingItem timestamp={afternoon.getTime()} />)
    expect(screen.getByText('☀️')).toBeVisible()

    // Evening: 18-21
    const evening = new Date()
    evening.setHours(19, 0, 0, 0)
    render(<NoiseTrackingItem timestamp={evening.getTime()} />)
    expect(screen.getByText('🌆')).toBeVisible()

    // Night: 21-6
    const night = new Date()
    night.setHours(23, 0, 0, 0)
    render(<NoiseTrackingItem timestamp={night.getTime()} />)
    expect(screen.getByText('🌙')).toBeVisible()
  })
})
