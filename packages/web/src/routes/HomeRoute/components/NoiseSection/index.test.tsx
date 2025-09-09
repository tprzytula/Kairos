import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import theme from '../../../../theme'
import { NoiseSection } from './index'
import { INoiseTrackingItem } from '../../../../api/noiseTracking'
import { INoiseCounts } from '../../../../hooks/useHomeData/types'

const createMockNoiseItem = (timestamp: number): INoiseTrackingItem => ({
  timestamp
})

const createMockNoiseCounts = (overrides: Partial<INoiseCounts> = {}): INoiseCounts => ({
  todayCount: 0,
  last7DaysCount: 0,
  last30DaysCount: 0,
  totalCount: 0,
  ...overrides
})

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('NoiseSection component', () => {
  const mockOnNoiseViewChange = jest.fn()

  beforeEach(() => {
    mockOnNoiseViewChange.mockClear()
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('when loading', () => {
    it('should show loading placeholders', () => {
      const noiseCounts = createMockNoiseCounts()
      
      renderWithTheme(
        <NoiseSection
          noiseTrackingItems={[]}
          noiseCounts={noiseCounts}
          isLoading={true}
          noiseView="overview"
          onNoiseViewChange={mockOnNoiseViewChange}
        />
      )
      
      expect(screen.getByText('Noise Recordings')).toBeInTheDocument()
      expect(screen.getByText('0')).toBeInTheDocument()
    })
  })

  describe('when no noise items exist', () => {
    it('should show empty state message in overview', () => {
      const noiseCounts = createMockNoiseCounts()
      
      renderWithTheme(
        <NoiseSection
          noiseTrackingItems={[]}
          noiseCounts={noiseCounts}
          isLoading={false}
          noiseView="overview"
          onNoiseViewChange={mockOnNoiseViewChange}
        />
      )
      
      expect(screen.getByText('No noise recordings found')).toBeInTheDocument()
    })
  })

  describe('when in overview mode with noise items', () => {
    it('should display noise statistics', () => {
      const noiseCounts = createMockNoiseCounts({
        todayCount: 3,
        last7DaysCount: 8,
        last30DaysCount: 15,
        totalCount: 15
      })
      
      renderWithTheme(
        <NoiseSection
          noiseTrackingItems={[]}
          noiseCounts={noiseCounts}
          isLoading={false}
          noiseView="overview"
          onNoiseViewChange={mockOnNoiseViewChange}
        />
      )
      
      expect(screen.getByText('Noise Recordings')).toBeInTheDocument()
      expect(screen.getAllByText('15')).toHaveLength(2) // header count + last 30 days
      expect(screen.getByText('3')).toBeInTheDocument() // today
      expect(screen.getByText('8')).toBeInTheDocument() // last 7 days
      expect(screen.getByText('Today')).toBeInTheDocument()
      expect(screen.getByText('Last 7 days')).toBeInTheDocument()
      expect(screen.getByText('Last 30 days')).toBeInTheDocument()
    })

    it('should handle stat block clicks', () => {
      const noiseCounts = createMockNoiseCounts({
        todayCount: 3,
        last7DaysCount: 8,
        last30DaysCount: 15,
        totalCount: 15
      })
      
      renderWithTheme(
        <NoiseSection
          noiseTrackingItems={[]}
          noiseCounts={noiseCounts}
          isLoading={false}
          noiseView="overview"
          onNoiseViewChange={mockOnNoiseViewChange}
        />
      )
      
      fireEvent.click(screen.getByText('Today'))
      expect(mockOnNoiseViewChange).toHaveBeenCalledWith('today')
      
      fireEvent.click(screen.getByText('Last 7 days'))
      expect(mockOnNoiseViewChange).toHaveBeenCalledWith('last7days')
      
      fireEvent.click(screen.getByText('Last 30 days'))
      expect(mockOnNoiseViewChange).toHaveBeenCalledWith('last30days')
    })
  })

  describe('when in detail view', () => {
    it('should show today\'s recordings', () => {
      const todayTimestamp = new Date('2024-01-15T14:00:00Z').getTime()
      const yesterdayTimestamp = new Date('2024-01-14T14:00:00Z').getTime()
      
      const noiseItems = [
        createMockNoiseItem(todayTimestamp),
        createMockNoiseItem(yesterdayTimestamp)
      ]
      
      const noiseCounts = createMockNoiseCounts({
        todayCount: 1,
        totalCount: 2
      })
      
      renderWithTheme(
        <NoiseSection
          noiseTrackingItems={noiseItems}
          noiseCounts={noiseCounts}
          isLoading={false}
          noiseView="today"
          onNoiseViewChange={mockOnNoiseViewChange}
        />
      )
      
      expect(screen.getByText('Today\'s Recordings')).toBeInTheDocument()
      expect(screen.getByText('Today')).toBeInTheDocument()
      expect(screen.getByText('02:00 PM')).toBeInTheDocument()
      expect(screen.queryByText('Yesterday')).not.toBeInTheDocument()
      expect(screen.getByText('Back')).toBeInTheDocument()
    })

    it('should show last 7 days recordings', () => {
      const todayTimestamp = new Date('2024-01-15T14:00:00Z').getTime()
      const threeDaysAgoTimestamp = new Date('2024-01-12T14:00:00Z').getTime()
      const tenDaysAgoTimestamp = new Date('2024-01-05T14:00:00Z').getTime()
      
      const noiseItems = [
        createMockNoiseItem(todayTimestamp),
        createMockNoiseItem(threeDaysAgoTimestamp),
        createMockNoiseItem(tenDaysAgoTimestamp)
      ]
      
      const noiseCounts = createMockNoiseCounts({
        last7DaysCount: 2,
        totalCount: 3
      })
      
      renderWithTheme(
        <NoiseSection
          noiseTrackingItems={noiseItems}
          noiseCounts={noiseCounts}
          isLoading={false}
          noiseView="last7days"
          onNoiseViewChange={mockOnNoiseViewChange}
        />
      )
      
      expect(screen.getByText('Last 7 Days')).toBeInTheDocument()
      expect(screen.getByText('Today')).toBeInTheDocument()
      expect(screen.getByText('Fri, Jan 12')).toBeInTheDocument()
      expect(screen.queryByText('Fri, Jan 5')).not.toBeInTheDocument() // older than 7 days
    })

    it('should show empty state when no items match filter', () => {
      const tenDaysAgoTimestamp = new Date('2024-01-05T14:00:00Z').getTime()
      const noiseItems = [createMockNoiseItem(tenDaysAgoTimestamp)]
      
      const noiseCounts = createMockNoiseCounts({
        todayCount: 0,
        totalCount: 1
      })
      
      renderWithTheme(
        <NoiseSection
          noiseTrackingItems={noiseItems}
          noiseCounts={noiseCounts}
          isLoading={false}
          noiseView="today"
          onNoiseViewChange={mockOnNoiseViewChange}
        />
      )
      
      expect(screen.getByText('Today\'s Recordings')).toBeInTheDocument()
      expect(screen.getByText('No recordings found for today\'s recordings')).toBeInTheDocument()
    })

    it('should handle back button click', () => {
      const noiseCounts = createMockNoiseCounts()
      
      renderWithTheme(
        <NoiseSection
          noiseTrackingItems={[]}
          noiseCounts={noiseCounts}
          isLoading={false}
          noiseView="today"
          onNoiseViewChange={mockOnNoiseViewChange}
        />
      )
      
      fireEvent.click(screen.getByText('Back'))
      expect(mockOnNoiseViewChange).toHaveBeenCalledWith('overview')
    })
  })

  describe('sorting', () => {
    it('should sort items by timestamp descending (newest first)', () => {
      const olderTimestamp = new Date('2024-01-15T10:00:00Z').getTime()
      const newerTimestamp = new Date('2024-01-15T14:00:00Z').getTime()
      
      const noiseItems = [
        createMockNoiseItem(olderTimestamp),
        createMockNoiseItem(newerTimestamp)
      ]
      
      const noiseCounts = createMockNoiseCounts({
        todayCount: 2,
        totalCount: 2
      })
      
      renderWithTheme(
        <NoiseSection
          noiseTrackingItems={noiseItems}
          noiseCounts={noiseCounts}
          isLoading={false}
          noiseView="today"
          onNoiseViewChange={mockOnNoiseViewChange}
        />
      )
      
      const timeElements = screen.getAllByText(/\d{2}:\d{2} [AP]M/)
      expect(timeElements[0]).toHaveTextContent('02:00 PM') // newer first
      expect(timeElements[1]).toHaveTextContent('10:00 AM') // older second
    })
  })
})
