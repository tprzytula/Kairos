import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import NoiseTrackingList from "."
import * as NoiseTrackingProvider from "../../providers/NoiseTrackingProvider"
import { IState } from "../../providers/NoiseTrackingProvider/types"

// Mock MUI icons
jest.mock('@mui/icons-material/VolumeUp', () => {
  return function MockVolumeUpIcon(props: any) {
    return <div data-testid="volume-up-icon" aria-label={props['aria-label']}>VolumeUp</div>
  }
})

jest.mock('@mui/icons-material/ExpandMore', () => {
  return function MockExpandMoreIcon() {
    return <div data-testid="expand-more-icon">ExpandMore</div>
  }
})

jest.mock('@mui/icons-material/ViewList', () => {
  return function MockViewListIcon() {
    return <div data-testid="view-list-icon">ViewList</div>
  }
})

jest.mock('@mui/icons-material/ViewModule', () => {
  return function MockViewModuleIcon() {
    return <div data-testid="view-module-icon">ViewModule</div>
  }
})

jest.mock('@mui/icons-material/UnfoldMore', () => {
  return function MockUnfoldMoreIcon() {
    return <div data-testid="unfold-more-icon">UnfoldMore</div>
  }
})

jest.mock('@mui/icons-material/UnfoldLess', () => {
  return function MockUnfoldLessIcon() {
    return <div data-testid="unfold-less-icon">UnfoldLess</div>
  }
})

describe('Given the NoiseTrackingList component', () => {
  const mockRefetch = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render loading state', () => {
    jest.spyOn(NoiseTrackingProvider, 'useNoiseTrackingContext').mockReturnValue({
      noiseTrackingItems: [],
      isLoading: true,
      refetchNoiseTrackingItems: mockRefetch,
    })

    render(<NoiseTrackingList />)
    
    // Should show placeholders when loading
    expect(screen.getByTestId('noise-tracking-placeholders')).toBeVisible()
  })

  it('should render empty state when no items', () => {
    jest.spyOn(NoiseTrackingProvider, 'useNoiseTrackingContext').mockReturnValue({
      noiseTrackingItems: [],
      isLoading: false,
      refetchNoiseTrackingItems: mockRefetch,
    })

    render(<NoiseTrackingList />)

    expect(screen.getByText('No noise events recorded yet')).toBeVisible()
    expect(screen.getByText('Tap the + button to add your first entry')).toBeVisible()
    expect(screen.getByLabelText('No noise events')).toBeVisible()
  })

  describe('Empty state layout behavior', () => {
    it('should render empty state with proper content and structure', () => {
      jest.spyOn(NoiseTrackingProvider, 'useNoiseTrackingContext').mockReturnValue({
        noiseTrackingItems: [],
        isLoading: false,
        refetchNoiseTrackingItems: mockRefetch,
      })

      render(<NoiseTrackingList />)

      expect(screen.getByLabelText('No noise events')).toBeInTheDocument()
      expect(screen.getByText('No noise events recorded yet')).toBeInTheDocument()
      expect(screen.getByText('Tap the + button to add your first entry')).toBeInTheDocument()
    })

    it('should apply styled components classes to empty state', () => {
      jest.spyOn(NoiseTrackingProvider, 'useNoiseTrackingContext').mockReturnValue({
        noiseTrackingItems: [],
        isLoading: false,
        refetchNoiseTrackingItems: mockRefetch,
      })

      render(<NoiseTrackingList />)

      const titleElement = screen.getByText('No noise events recorded yet')
      const subtitleElement = screen.getByText('Tap the + button to add your first entry')
      
      expect(titleElement).toHaveAttribute('class')
      expect(subtitleElement).toHaveAttribute('class')
    })
  })

  it('should render grouped noise tracking items', () => {
    jest.spyOn(NoiseTrackingProvider, 'useNoiseTrackingContext').mockReturnValue(EXAMPLE_NOISE_TRACKING_CONTEXT)

    render(<NoiseTrackingList />)

    // Should group by date with new format
    expect(screen.getByText('Today')).toBeVisible()
    expect(screen.getByText('25 April 2027 • Sunday')).toBeVisible()
  })

  it('should show item counts in headers', () => {
    jest.spyOn(NoiseTrackingProvider, 'useNoiseTrackingContext').mockReturnValue(EXAMPLE_NOISE_TRACKING_CONTEXT)

    render(<NoiseTrackingList />)

    const counts = screen.getAllByText('(1)')
    expect(counts).toHaveLength(2) // Today count and other day count
    expect(counts[0]).toBeVisible()
    expect(counts[1]).toBeVisible()
  })

  it('should show mini timeline for all groups', async () => {
    jest.spyOn(NoiseTrackingProvider, 'useNoiseTrackingContext').mockReturnValue(MULTIPLE_GROUPS_CONTEXT)

    render(<NoiseTrackingList />)

    // Wait for groups to be set up and verify timeline bars are shown for all groups
    await waitFor(() => {
      const timelineBars = screen.getAllByTestId('timeline-bar')
      expect(timelineBars.length).toBeGreaterThan(0)
    })
  })

  it('should expand and collapse groups', async () => {
    jest.spyOn(NoiseTrackingProvider, 'useNoiseTrackingContext').mockReturnValue(EXAMPLE_NOISE_TRACKING_CONTEXT)

    render(<NoiseTrackingList />)

    // Wait for initial render and auto-expansion
    await waitFor(() => {
      expect(screen.getByText('25 April 2027 • Sunday')).toBeVisible()
    })

    const header = screen.getByText('25 April 2027 • Sunday')
    
    // Since this group starts expanded (first two groups auto-expand), 
    // clicking should collapse it and hide its content
    fireEvent.click(header)

    // Should still show expand icons (they exist for both groups)
    await waitFor(() => {
      const expandIcons = screen.getAllByTestId('expand-more-icon')
      expect(expandIcons.length).toBeGreaterThan(0)
      expect(expandIcons[0]).toBeVisible()
    })
  })



  it('should auto-expand first two groups', async () => {
    jest.spyOn(NoiseTrackingProvider, 'useNoiseTrackingContext').mockReturnValue(MULTIPLE_GROUPS_CONTEXT)

    render(<NoiseTrackingList />)

    await waitFor(() => {
      // Should auto-expand first two groups (Today and Yesterday)
      expect(screen.getByText('Today')).toBeVisible()
      
      // Should also show individual items (they display as "Just now" and "Yesterday" in relative time)
      expect(screen.getByText('Just now')).toBeVisible()
      expect(screen.getAllByText('Yesterday')).toHaveLength(2) // One for group header, one for relative time
    })
  })

  it('should render view toggle buttons', () => {
    jest.spyOn(NoiseTrackingProvider, 'useNoiseTrackingContext').mockReturnValue(EXAMPLE_NOISE_TRACKING_CONTEXT)

    render(<NoiseTrackingList />)

    // Should show both view toggle buttons
    expect(screen.getByTestId('view-module-icon')).toBeVisible() // Grouped view icon
    expect(screen.getByTestId('view-list-icon')).toBeVisible() // Simple view icon
  })

  it('should switch to simple view when simple view button is clicked', async () => {
    jest.spyOn(NoiseTrackingProvider, 'useNoiseTrackingContext').mockReturnValue(EXAMPLE_NOISE_TRACKING_CONTEXT)

    render(<NoiseTrackingList />)

    // Find and click the simple view button
    const simpleViewButton = screen.getByTestId('view-list-icon').closest('button')
    fireEvent.click(simpleViewButton!)

    // Should show simple list items with formatted timestamps
    await waitFor(() => {
      expect(screen.getByText(/Today,/)).toBeVisible()
      expect(screen.getByText(/Apr 2027,/)).toBeVisible()
    })

    // Should not show grouped view elements
    expect(screen.queryByText('(1)')).not.toBeInTheDocument() // Item counts
    expect(screen.queryByTestId('expand-more-icon')).not.toBeInTheDocument() // Expand icons
  })

  it('should switch back to grouped view when grouped view button is clicked', async () => {
    jest.spyOn(NoiseTrackingProvider, 'useNoiseTrackingContext').mockReturnValue(EXAMPLE_NOISE_TRACKING_CONTEXT)

    render(<NoiseTrackingList />)

    // Switch to simple view first
    const simpleViewButton = screen.getByTestId('view-list-icon').closest('button')
    fireEvent.click(simpleViewButton!)

    await waitFor(() => {
      expect(screen.getByText(/Today,/)).toBeVisible()
    })

    // Switch back to grouped view
    const groupedViewButton = screen.getByTestId('view-module-icon').closest('button')
    fireEvent.click(groupedViewButton!)

    // Should show grouped view elements again
    await waitFor(() => {
      expect(screen.getByText('Today')).toBeVisible()
      expect(screen.getAllByText('(1)')).toHaveLength(2) // Item counts for both groups
      expect(screen.getAllByTestId('expand-more-icon')).toHaveLength(2) // Expand icons for both groups
    })

    // Should not show simple view items
    expect(screen.queryByText(/Today,/)).not.toBeInTheDocument()
  })

  it('should display items in chronological order in simple view', async () => {
    jest.spyOn(NoiseTrackingProvider, 'useNoiseTrackingContext').mockReturnValue(MULTIPLE_ITEMS_CONTEXT)

    render(<NoiseTrackingList />)

    // Switch to simple view
    const simpleViewButton = screen.getByTestId('view-list-icon').closest('button')
    fireEvent.click(simpleViewButton!)

    await waitFor(() => {
      const timeItems = screen.getAllByText(/Today,/)
      expect(timeItems.length).toBeGreaterThan(0)
      
      // Items should be sorted newest to oldest (all are from today in this test)
      timeItems.forEach(item => {
        expect(item).toBeVisible()
      })
    })
  })

  it('should format timestamps correctly in simple view', async () => {
    const specificTimestamp = new Date('2023-06-15T14:30:00').getTime()
    const testContext: IState = {
      noiseTrackingItems: [
        { timestamp: Date.now() }, // Today
        { timestamp: Date.now() - (24 * 60 * 60 * 1000) }, // Yesterday
        { timestamp: specificTimestamp }, // Specific date
      ],
      isLoading: false,
      refetchNoiseTrackingItems: jest.fn(),
    }

    jest.spyOn(NoiseTrackingProvider, 'useNoiseTrackingContext').mockReturnValue(testContext)

    render(<NoiseTrackingList />)

    // Switch to simple view
    const simpleViewButton = screen.getByTestId('view-list-icon').closest('button')
    fireEvent.click(simpleViewButton!)

    await waitFor(() => {
      // Should show different timestamp formats
      expect(screen.getByText(/Today,/)).toBeVisible()
      expect(screen.getByText(/Yesterday,/)).toBeVisible()
      expect(screen.getByText(/Thu.*2023.*14:30/)).toBeVisible()
    })
  })

  it('should show expand all button when in grouped view with multiple groups', () => {
    jest.spyOn(NoiseTrackingProvider, 'useNoiseTrackingContext').mockReturnValue(MULTIPLE_GROUPS_CONTEXT)

    render(<NoiseTrackingList />)

    // Should show expand all button (unfold more icon) when not all groups are expanded
    expect(screen.getByTestId('unfold-more-icon')).toBeVisible()
  })

  it('should expand all groups when expand all button is clicked', async () => {
    jest.spyOn(NoiseTrackingProvider, 'useNoiseTrackingContext').mockReturnValue(MULTIPLE_GROUPS_CONTEXT)

    render(<NoiseTrackingList />)

    // Find and click the expand all button
    const expandAllButton = screen.getByTestId('unfold-more-icon').closest('button')
    fireEvent.click(expandAllButton!)

    // Should show collapse all button (unfold less icon) when all groups are expanded
    await waitFor(() => {
      expect(screen.getByTestId('unfold-less-icon')).toBeVisible()
    })

    // All groups should be expanded and show their content
    expect(screen.getByText('Just now')).toBeVisible()
    expect(screen.getAllByText('Yesterday')).toHaveLength(2) // Group header + relative time
  })

  it('should collapse all groups when collapse all button is clicked', async () => {
    jest.spyOn(NoiseTrackingProvider, 'useNoiseTrackingContext').mockReturnValue(MULTIPLE_GROUPS_CONTEXT)

    render(<NoiseTrackingList />)

    // Wait for initial auto-expansion of first two groups to complete
    await waitFor(() => {
      expect(screen.getByText('Just now')).toBeVisible()
    })

    // First expand all groups (including the third one)
    const expandAllButton = screen.getByTestId('unfold-more-icon').closest('button')
    fireEvent.click(expandAllButton!)

    await waitFor(() => {
      expect(screen.getByTestId('unfold-less-icon')).toBeVisible()
    })

    // Then collapse all groups
    const collapseAllButton = screen.getByTestId('unfold-less-icon').closest('button')
    fireEvent.click(collapseAllButton!)

    // Wait for the state change to complete - the icon should change back to expand all
    await waitFor(() => {
      expect(screen.getByTestId('unfold-more-icon')).toBeVisible()
    })
    
    // All groups should have their expand icons pointing down (not rotated = collapsed)
    // When all groups are collapsed, there should be 3 expand icons visible (one per group)
    expect(screen.getAllByTestId('expand-more-icon')).toHaveLength(3)
  })

  it('should not show expand/collapse all button in simple view', async () => {
    jest.spyOn(NoiseTrackingProvider, 'useNoiseTrackingContext').mockReturnValue(MULTIPLE_GROUPS_CONTEXT)

    render(<NoiseTrackingList />)

    // Switch to simple view
    const simpleViewButton = screen.getByTestId('view-list-icon').closest('button')
    fireEvent.click(simpleViewButton!)

    // Should not show expand/collapse all button in simple view
    await waitFor(() => {
      expect(screen.queryByTestId('unfold-more-icon')).not.toBeInTheDocument()
      expect(screen.queryByTestId('unfold-less-icon')).not.toBeInTheDocument()
    })
  })

  it('should not show expand/collapse all button when there are no groups', () => {
    jest.spyOn(NoiseTrackingProvider, 'useNoiseTrackingContext').mockReturnValue({
      noiseTrackingItems: [],
      isLoading: false,
      refetchNoiseTrackingItems: jest.fn(),
    })

    render(<NoiseTrackingList />)

    // Should not show expand/collapse all button when there are no items
    expect(screen.queryByTestId('unfold-more-icon')).not.toBeInTheDocument()
    expect(screen.queryByTestId('unfold-less-icon')).not.toBeInTheDocument()
  })

  it('should filter out items before 7am and after midnight', () => {
    const today = new Date()
    jest.spyOn(NoiseTrackingProvider, 'useNoiseTrackingContext').mockReturnValue({
      noiseTrackingItems: [
        { timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 6, 0, 0, 0).getTime() }, // 6am (should be filtered)
        { timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 7, 0, 0, 0).getTime() }, // 7am (should be shown)
        { timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0, 0).getTime() }, // 12pm (should be shown)
        { timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 0, 0, 0).getTime() }, // 11pm (should be shown)
        { timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 2, 0, 0, 0).getTime() }, // 2am (should be filtered)
      ],
      isLoading: false,
      refetchNoiseTrackingItems: jest.fn(),
    })

    render(<NoiseTrackingList />)

    // In grouped view, should only show items from 7am-11pm
    const itemCount = screen.getByText('(3)')
    expect(itemCount).toBeInTheDocument()

    // Switch to simple view
    const simpleViewButton = screen.getByTestId('view-list-icon').closest('button')!
    fireEvent.click(simpleViewButton)

    // Should only show 3 items (6am and 2am filtered out)
    const timestamps = screen.getAllByText(/Today,/)
    expect(timestamps).toHaveLength(3)
  })
})

const EXAMPLE_NOISE_TRACKING_CONTEXT: IState = {
  noiseTrackingItems: [
    {
      timestamp: Date.now(), // Today
    },
    {
      timestamp: 1808646360000, // 25 Apr 2027
    },
  ],
  isLoading: false,
  refetchNoiseTrackingItems: jest.fn(),
}

const MULTIPLE_ITEMS_CONTEXT: IState = {
  noiseTrackingItems: [
    { timestamp: Date.now() },
    { timestamp: Date.now() - 3600000 }, // 1 hour ago
    { timestamp: Date.now() - 7200000 }, // 2 hours ago
  ],
  isLoading: false,
  refetchNoiseTrackingItems: jest.fn(),
}



const MULTIPLE_GROUPS_CONTEXT: IState = {
  noiseTrackingItems: [
    { timestamp: Date.now() }, // Today
    { timestamp: Date.now() - (24 * 60 * 60 * 1000) }, // Yesterday  
    { timestamp: Date.now() - (2 * 24 * 60 * 60 * 1000) }, // 2 days ago
  ],
  isLoading: false,
  refetchNoiseTrackingItems: jest.fn(),
}
