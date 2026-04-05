import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdventureGroupedItem from '.'
import { IAdventure } from '../../../../types/adventure'

const mockAdventure: IAdventure = {
  id: 'adv-1',
  projectId: 'project-1',
  name: 'Trip to Paris',
  date: '2026-05-15',
  location: 'Paris, France',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
}

describe('Given the AdventureGroupedItem component', () => {
  const mockOnClick = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('When rendering an adventure', () => {
    it('should display the adventure name', () => {
      render(<AdventureGroupedItem adventure={mockAdventure} onClick={mockOnClick} />)

      expect(screen.getByText('Trip to Paris')).toBeInTheDocument()
    })

    it('should display the adventure location', () => {
      render(<AdventureGroupedItem adventure={mockAdventure} onClick={mockOnClick} />)

      expect(screen.getByText(/Paris, France/)).toBeInTheDocument()
    })

    it('should display the formatted date', () => {
      render(<AdventureGroupedItem adventure={mockAdventure} onClick={mockOnClick} />)

      expect(screen.getByText(/15 May 2026/)).toBeInTheDocument()
    })
  })

  describe('When rendering a multi-day adventure', () => {
    it('should display the date range', () => {
      const multiDayAdventure: IAdventure = {
        ...mockAdventure,
        endDate: '2026-05-20',
      }

      render(<AdventureGroupedItem adventure={multiDayAdventure} onClick={mockOnClick} />)

      expect(screen.getByText(/15 May 2026/)).toBeInTheDocument()
      expect(screen.getByText(/20 May 2026/)).toBeInTheDocument()
    })
  })

  describe('When rendering an adventure without a location', () => {
    it('should not display a location row', () => {
      const noLocationAdventure: IAdventure = {
        ...mockAdventure,
        location: undefined,
      }

      render(<AdventureGroupedItem adventure={noLocationAdventure} onClick={mockOnClick} />)

      expect(screen.queryByText(/📍/)).not.toBeInTheDocument()
    })
  })

  describe('When rendering a private adventure', () => {
    it('should display the private badge', () => {
      const privateAdventure: IAdventure = {
        ...mockAdventure,
        visibility: 'private',
      }

      render(<AdventureGroupedItem adventure={privateAdventure} onClick={mockOnClick} />)

      expect(screen.getByTestId('VisibilityOffOutlinedIcon')).toBeInTheDocument()
    })
  })

  describe('When clicking on the adventure', () => {
    it('should call onClick with the adventure id', async () => {
      render(<AdventureGroupedItem adventure={mockAdventure} onClick={mockOnClick} />)

      await userEvent.click(screen.getByText('Trip to Paris'))

      expect(mockOnClick).toHaveBeenCalledWith('adv-1')
    })
  })
})
