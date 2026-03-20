import { Mock } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import BirthdayForm from './index'
import { useBirthdayContext } from '../../../providers/BirthdayProvider'

const mockNavigate = vi.fn()

vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}))

vi.mock('../../../providers/BirthdayProvider', () => ({
  useBirthdayContext: vi.fn(),
}))

vi.mock('../../../components/ItemForm/index.styled', () => ({
  FormContainer: ({ children }: any) => <div>{children}</div>,
  FormCard: ({ children }: any) => <div>{children}</div>,
  FormContent: ({ children }: any) => <div>{children}</div>,
  FormFieldsContainer: ({ children }: any) => <div>{children}</div>,
}))

const mockAddBirthdayItem = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
  ;(useBirthdayContext as Mock).mockReturnValue({
    addBirthdayItem: mockAddBirthdayItem,
    updateBirthdayItem: vi.fn(),
    removeBirthdayItem: vi.fn(),
    refetchBirthdays: vi.fn(),
    birthdays: [],
    isLoading: false,
  })
})

describe('Given the BirthdayForm component', () => {
  it('should render all form fields', () => {
    render(<BirthdayForm />)
    expect(screen.getByLabelText(/person's name/i)).toBeVisible()
    expect(screen.getByLabelText(/month/i)).toBeVisible()
    expect(screen.getByLabelText(/^day$/i)).toBeVisible()
    expect(screen.getByLabelText(/birth year/i)).toBeVisible()
    expect(screen.getByLabelText(/notes/i)).toBeVisible()
  })

  it('should render the Add Birthday submit button', () => {
    render(<BirthdayForm />)
    expect(screen.getByRole('button', { name: /add birthday/i })).toBeVisible()
  })

  it('should have submit button disabled when name and day are empty', () => {
    render(<BirthdayForm />)
    expect(screen.getByRole('button', { name: /add birthday/i })).toBeDisabled()
  })

  it('should enable submit button when name and day are filled', () => {
    render(<BirthdayForm />)
    fireEvent.change(screen.getByLabelText(/person's name/i), { target: { value: 'Alice' } })
    fireEvent.change(screen.getByLabelText(/^day$/i), { target: { value: '15' } })
    expect(screen.getByRole('button', { name: /add birthday/i })).not.toBeDisabled()
  })

  it('should show error when name is empty on submit', async () => {
    render(<BirthdayForm />)
    fireEvent.change(screen.getByLabelText(/^day$/i), { target: { value: '15' } })
    fireEvent.change(screen.getByLabelText(/person's name/i), { target: { value: '' } })
    // Bypass button disabled check by enabling via state manipulation isn't straightforward,
    // instead submit via form directly
    const form = document.querySelector('form')!
    fireEvent.submit(form)
    expect(await screen.findByText('Name is required')).toBeVisible()
  })

  it('should show error when day is invalid on submit', async () => {
    render(<BirthdayForm />)
    // Make form submittable by setting name, then trigger form submit
    const form = document.querySelector('form')!
    // Only way to submit with invalid day is to bypass the button disabled state
    fireEvent.change(screen.getByLabelText(/person's name/i), { target: { value: 'Alice' } })
    fireEvent.submit(form)
    expect(await screen.findByText(/valid day/i)).toBeVisible()
  })

  it('should show error for invalid birth year', async () => {
    render(<BirthdayForm />)
    fireEvent.change(screen.getByLabelText(/person's name/i), { target: { value: 'Alice' } })
    fireEvent.change(screen.getByLabelText(/^day$/i), { target: { value: '15' } })
    fireEvent.change(screen.getByLabelText(/birth year/i), { target: { value: '1800' } })
    fireEvent.click(screen.getByRole('button', { name: /add birthday/i }))
    expect(await screen.findByText(/birth year must be between/i)).toBeVisible()
  })

  it('should call addBirthdayItem with correct data on valid submit', async () => {
    mockAddBirthdayItem.mockResolvedValue(undefined)
    render(<BirthdayForm />)
    fireEvent.change(screen.getByLabelText(/person's name/i), { target: { value: 'Alice' } })
    fireEvent.change(screen.getByLabelText(/^day$/i), { target: { value: '15' } })
    fireEvent.click(screen.getByRole('button', { name: /add birthday/i }))
    await waitFor(() => expect(mockAddBirthdayItem).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Alice', day: 15, month: 1 })
    ))
  })

  it('should navigate to Planner after successful submit', async () => {
    mockAddBirthdayItem.mockResolvedValue(undefined)
    render(<BirthdayForm />)
    fireEvent.change(screen.getByLabelText(/person's name/i), { target: { value: 'Alice' } })
    fireEvent.change(screen.getByLabelText(/^day$/i), { target: { value: '15' } })
    fireEvent.click(screen.getByRole('button', { name: /add birthday/i }))
    await waitFor(() => expect(mockNavigate).toHaveBeenCalled())
  })

  it('should show error when addBirthdayItem rejects', async () => {
    mockAddBirthdayItem.mockRejectedValue(new Error('Failed to add'))
    render(<BirthdayForm />)
    fireEvent.change(screen.getByLabelText(/person's name/i), { target: { value: 'Alice' } })
    fireEvent.change(screen.getByLabelText(/^day$/i), { target: { value: '15' } })
    fireEvent.click(screen.getByRole('button', { name: /add birthday/i }))
    expect(await screen.findByText('Failed to add')).toBeVisible()
  })

  it('should include notes when provided', async () => {
    mockAddBirthdayItem.mockResolvedValue(undefined)
    render(<BirthdayForm />)
    fireEvent.change(screen.getByLabelText(/person's name/i), { target: { value: 'Alice' } })
    fireEvent.change(screen.getByLabelText(/^day$/i), { target: { value: '15' } })
    fireEvent.change(screen.getByLabelText(/notes/i), { target: { value: 'Best friend' } })
    fireEvent.click(screen.getByRole('button', { name: /add birthday/i }))
    await waitFor(() => expect(mockAddBirthdayItem).toHaveBeenCalledWith(
      expect.objectContaining({ notes: 'Best friend' })
    ))
  })
})
