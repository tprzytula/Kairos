import { render, screen, fireEvent } from '@testing-library/react'
import * as NoiseTrackingProvider from '../../providers/NoiseTrackingProvider'
import NoiseTrackingList from './index'

jest.mock('../../providers/NoiseTrackingProvider')

const MOCK_ITEMS = [
  { id: '1', timestamp: new Date('2025-08-23T14:58:00').getTime() },
  { id: '2', timestamp: new Date('2027-04-25T10:46:00').getTime() },
]

const EXAMPLE_NOISE_TRACKING_CONTEXT = {
  noiseTrackingItems: MOCK_ITEMS,
  isLoading: false,
  refetchNoiseTrackingItems: jest.fn(),
}

const mockRefetch = jest.fn()

describe('Given the NoiseTrackingList component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(NoiseTrackingProvider.useNoiseTrackingContext as jest.Mock).mockReturnValue(EXAMPLE_NOISE_TRACKING_CONTEXT)
  })

  it('should render loading state', () => {
    jest.spyOn(NoiseTrackingProvider, 'useNoiseTrackingContext').mockReturnValue({
      noiseTrackingItems: [],
      isLoading: true,
      refetchNoiseTrackingItems: mockRefetch,
    })

    render(<NoiseTrackingList 
      viewMode="grouped"
      expandedGroups={new Set()}
      setExpandedGroups={jest.fn()}
    />)
    
    expect(screen.getByTestId('noise-tracking-placeholders')).toBeVisible()
  })

  it('should render empty state when no items', () => {
    jest.spyOn(NoiseTrackingProvider, 'useNoiseTrackingContext').mockReturnValue({
      noiseTrackingItems: [],
      isLoading: false,
      refetchNoiseTrackingItems: mockRefetch,
    })

    render(<NoiseTrackingList 
      viewMode="grouped"
      expandedGroups={new Set()}
      setExpandedGroups={jest.fn()}
    />)

    expect(screen.getByText('No noise events recorded yet')).toBeInTheDocument()
  })

  it('should render noise items in grouped view', () => {
    render(<NoiseTrackingList 
      viewMode="grouped"
      expandedGroups={new Set()}
      setExpandedGroups={jest.fn()}
    />)

    expect(screen.getByText('Today')).toBeInTheDocument()
    expect(screen.getByText('25 April 2027 • Sunday')).toBeInTheDocument()
  })

  it('should render noise items in simple view with timestamps', () => {
    render(<NoiseTrackingList 
      viewMode="simple"
      expandedGroups={new Set()}
      setExpandedGroups={jest.fn()}
    />)

    expect(screen.getByText('Today, 14:58')).toBeInTheDocument()
    expect(screen.getByText('Sun, 25 Apr 2027, 10:46')).toBeInTheDocument()
  })
})