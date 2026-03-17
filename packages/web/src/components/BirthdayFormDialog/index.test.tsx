import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import BirthdayFormDialog from './index'
import { useBirthdayContext } from '../../providers/BirthdayProvider'

jest.mock('../../providers/BirthdayProvider', () => ({
  useBirthdayContext: jest.fn(),
}))

const mockAddBirthdayItem = jest.fn()
const mockUpdateBirthdayItem = jest.fn()

const defaultBirthdayContext = {
  addBirthdayItem: mockAddBirthdayItem,
  updateBirthdayItem: mockUpdateBirthdayItem,
  removeBirthdayItem: jest.fn(),
  refetchBirthdays: jest.fn(),
  birthdays: [],
  isLoading: false,
}

const exampleBirthday = {
  id: 'bday-1',
  name: 'Alice',
  month: 6,
  day: 15,
  birthYear: 1990,
  notes: 'Best friend',
}

beforeEach(() => {
  jest.clearAllMocks()
  ;(useBirthdayContext as jest.Mock).mockReturnValue(defaultBirthdayContext)
})

describe('Given the BirthdayFormDialog component', () => {
  describe('When open in add mode', () => {
    it('should render the Add Birthday title', () => {
      render(<BirthdayFormDialog open={true} onClose={jest.fn()} />)
      const headings = screen.getAllByRole('heading', { name: /add birthday/i })
      expect(headings.length).toBeGreaterThan(0)
      expect(headings[0]).toBeVisible()
    })

    it('should render all form fields', () => {
      render(<BirthdayFormDialog open={true} onClose={jest.fn()} />)
      expect(screen.getByLabelText(/person's name/i)).toBeVisible()
      expect(screen.getByLabelText(/month/i)).toBeVisible()
      expect(screen.getByLabelText(/^day$/i)).toBeVisible()
      expect(screen.getByLabelText(/birth year/i)).toBeVisible()
      expect(screen.getByLabelText(/notes/i)).toBeVisible()
    })

    it('should call onClose when Cancel is clicked', () => {
      const onClose = jest.fn()
      render(<BirthdayFormDialog open={true} onClose={onClose} />)
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
      expect(onClose).toHaveBeenCalled()
    })

    it('should show error when name is empty on submit', async () => {
      render(<BirthdayFormDialog open={true} onClose={jest.fn()} />)
      // Trigger via Enter key since button is disabled when name/day are empty
      fireEvent.keyPress(screen.getByLabelText(/birth year/i), { key: 'Enter', code: 'Enter', charCode: 13 })
      expect(await screen.findByText('Name is required')).toBeVisible()
      expect(mockAddBirthdayItem).not.toHaveBeenCalled()
    })

    it('should show error when day is invalid', async () => {
      render(<BirthdayFormDialog open={true} onClose={jest.fn()} />)
      fireEvent.change(screen.getByLabelText(/person's name/i), { target: { value: 'Alice' } })
      // Trigger via Enter key since button is disabled when day is empty
      fireEvent.keyPress(screen.getByLabelText(/person's name/i), { key: 'Enter', code: 'Enter', charCode: 13 })
      expect(await screen.findByText(/valid day/i)).toBeVisible()
    })

    it('should show error for invalid birth year', async () => {
      render(<BirthdayFormDialog open={true} onClose={jest.fn()} />)
      fireEvent.change(screen.getByLabelText(/person's name/i), { target: { value: 'Alice' } })
      fireEvent.change(screen.getByLabelText(/^day$/i), { target: { value: '15' } })
      fireEvent.change(screen.getByLabelText(/birth year/i), { target: { value: '1800' } })
      fireEvent.click(screen.getByRole('button', { name: /add birthday/i }))
      expect(await screen.findByText(/birth year must be between/i)).toBeVisible()
    })

    it('should call addBirthdayItem with correct data on valid submit', async () => {
      mockAddBirthdayItem.mockResolvedValue(undefined)
      const onClose = jest.fn()
      render(<BirthdayFormDialog open={true} onClose={onClose} />)
      fireEvent.change(screen.getByLabelText(/person's name/i), { target: { value: 'Alice' } })
      fireEvent.change(screen.getByLabelText(/^day$/i), { target: { value: '15' } })
      fireEvent.click(screen.getByRole('button', { name: /add birthday/i }))
      await waitFor(() => expect(mockAddBirthdayItem).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Alice', day: 15 })
      ))
      expect(onClose).toHaveBeenCalled()
    })

    it('should show error when addBirthdayItem rejects', async () => {
      mockAddBirthdayItem.mockRejectedValue(new Error('Server error'))
      render(<BirthdayFormDialog open={true} onClose={jest.fn()} />)
      fireEvent.change(screen.getByLabelText(/person's name/i), { target: { value: 'Alice' } })
      fireEvent.change(screen.getByLabelText(/^day$/i), { target: { value: '15' } })
      fireEvent.click(screen.getByRole('button', { name: /add birthday/i }))
      expect(await screen.findByText('Server error')).toBeVisible()
    })
  })

  describe('When open in edit mode', () => {
    it('should render the Edit Birthday title', () => {
      render(<BirthdayFormDialog open={true} onClose={jest.fn()} initialBirthday={exampleBirthday} />)
      expect(screen.getByText('Edit Birthday')).toBeVisible()
    })

    it('should pre-populate the form with the existing birthday data', () => {
      render(<BirthdayFormDialog open={true} onClose={jest.fn()} initialBirthday={exampleBirthday} />)
      expect(screen.getByDisplayValue('Alice')).toBeVisible()
      expect(screen.getByDisplayValue('15')).toBeVisible()
      expect(screen.getByDisplayValue('Best friend')).toBeVisible()
    })

    it('should call updateBirthdayItem on valid submit', async () => {
      mockUpdateBirthdayItem.mockResolvedValue(undefined)
      const onClose = jest.fn()
      render(<BirthdayFormDialog open={true} onClose={onClose} initialBirthday={exampleBirthday} />)
      fireEvent.click(screen.getByRole('button', { name: /save/i }))
      await waitFor(() => expect(mockUpdateBirthdayItem).toHaveBeenCalledWith(
        'bday-1',
        expect.objectContaining({ name: 'Alice', day: 15 })
      ))
      expect(onClose).toHaveBeenCalled()
    })
  })

  describe('When the dialog is closed', () => {
    it('should reset the form when reopened without initialBirthday', () => {
      const { rerender } = render(<BirthdayFormDialog open={false} onClose={jest.fn()} />)
      rerender(<BirthdayFormDialog open={true} onClose={jest.fn()} />)
      expect(screen.getByLabelText(/person's name/i)).toHaveValue('')
    })
  })
})
