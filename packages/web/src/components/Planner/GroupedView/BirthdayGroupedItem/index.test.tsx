import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BirthdayGroupedItem from '.'
import { IBirthdayWithNextDate } from '../../utils/timeGrouping'

const createBirthday = (
  overrides: Partial<IBirthdayWithNextDate> = {}
): IBirthdayWithNextDate => ({
  id: 'bday-1',
  name: 'Alice Smith',
  month: 4,
  day: 8,
  nextDate: '2026-04-08',
  ...overrides,
})

describe('Given the BirthdayGroupedItem component', () => {
  const mockOnClick = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the birthday name', () => {
    render(
      <BirthdayGroupedItem birthday={createBirthday()} onClick={mockOnClick} />
    )

    expect(screen.getByText('Alice Smith')).toBeInTheDocument()
  })

  it('should render the formatted date', () => {
    render(
      <BirthdayGroupedItem birthday={createBirthday()} onClick={mockOnClick} />
    )

    expect(screen.getByText(/8 Apr/)).toBeInTheDocument()
  })

  it('should render the age when birthYear is provided', () => {
    render(
      <BirthdayGroupedItem
        birthday={createBirthday({ birthYear: 1990 })}
        onClick={mockOnClick}
      />
    )

    expect(screen.getByText(/turning 36/)).toBeInTheDocument()
  })

  it('should not render the age when birthYear is not provided', () => {
    render(
      <BirthdayGroupedItem birthday={createBirthday()} onClick={mockOnClick} />
    )

    expect(screen.queryByText(/turning/)).not.toBeInTheDocument()
  })

  it('should call onClick with the birthday id when clicked', async () => {
    render(
      <BirthdayGroupedItem birthday={createBirthday()} onClick={mockOnClick} />
    )

    await userEvent.click(screen.getByText('Alice Smith'))

    expect(mockOnClick).toHaveBeenCalledWith('bday-1')
  })

  it('should render the private badge when visibility is private', () => {
    render(
      <BirthdayGroupedItem
        birthday={createBirthday({ visibility: 'private' })}
        onClick={mockOnClick}
      />
    )

    expect(screen.getByTestId('VisibilityOffOutlinedIcon')).toBeInTheDocument()
  })
})
