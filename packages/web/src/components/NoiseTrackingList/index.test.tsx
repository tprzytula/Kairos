import { Mock } from 'vitest'
import { render, screen } from '@testing-library/react'
import * as NoiseTrackingProvider from '../../providers/NoiseTrackingProvider'
import NoiseTrackingList from './index'
import { ViewMode } from './types'

vi.mock('../../providers/NoiseTrackingProvider')

const MOCK_ITEMS = [
  { id: '1', timestamp: new Date().setHours(14, 58, 0, 0) },
  { id: '2', timestamp: new Date('2027-04-25T10:46:00').getTime() },
]

const EXAMPLE_NOISE_TRACKING_CONTEXT = {
  noiseTrackingItems: MOCK_ITEMS,
  isLoading: false,
  refetchNoiseTrackingItems: vi.fn(),
  addItemToCache: vi.fn(),
  removeItemFromCache: vi.fn(),
}

const mockRefetch = vi.fn()

describe('Given the NoiseTrackingList component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(NoiseTrackingProvider.useNoiseTrackingContext as Mock).mockReturnValue(EXAMPLE_NOISE_TRACKING_CONTEXT)
  })

  it('should render loading state', () => {
    vi.spyOn(NoiseTrackingProvider, 'useNoiseTrackingContext').mockReturnValue({
      noiseTrackingItems: [],
      isLoading: true,
      refetchNoiseTrackingItems: mockRefetch,
      addItemToCache: vi.fn(),
      removeItemFromCache: vi.fn(),
    })

    render(<NoiseTrackingList 
      viewMode={ViewMode.Grouped}
      allExpanded={true}
      expandKey={0}
    />)
    
    expect(screen.getByLabelText('Loading noise tracking items')).toBeVisible()
  })

  it('should render empty state when no items', () => {
    vi.spyOn(NoiseTrackingProvider, 'useNoiseTrackingContext').mockReturnValue({
      noiseTrackingItems: [],
      isLoading: false,
      refetchNoiseTrackingItems: mockRefetch,
      addItemToCache: vi.fn(),
      removeItemFromCache: vi.fn(),
    })

    render(<NoiseTrackingList 
      viewMode={ViewMode.Grouped}
      allExpanded={true}
      expandKey={0}
    />)

    expect(screen.getByText('No noise events recorded yet')).toBeInTheDocument()
  })

  it('should render noise items in grouped view', () => {
    render(<NoiseTrackingList 
      viewMode={ViewMode.Grouped}
      allExpanded={true}
      expandKey={0}
    />)

    expect(screen.getByText('Today')).toBeInTheDocument()
    expect(screen.getByText('25 April 2027 • Sunday')).toBeInTheDocument()
  })

  it('should render noise items in simple view with NoiseTrackingItem components', () => {
    render(<NoiseTrackingList 
      viewMode={ViewMode.Simple}
      allExpanded={true}
      expandKey={0}
    />)

    // Now using NoiseTrackingItem components which format dates differently
    expect(screen.getByText('25 Apr 2027, 10:46')).toBeInTheDocument()
    // The "today" item would show current date - check for time portion
    expect(screen.getByText('14:58', { exact: false })).toBeInTheDocument()
  })
})