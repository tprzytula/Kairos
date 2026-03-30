import { Mock } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import MealForm from './index'
import { useMealPlanContext } from '../../../providers/MealPlanProvider'
import { useRecipeContext } from '../../../providers/RecipeProvider'
import { useAppState } from '../../../providers/AppStateProvider'

const mockNavigate = vi.fn()

vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}))

vi.mock('../../../providers/MealPlanProvider', () => ({
  useMealPlanContext: vi.fn(),
}))

vi.mock('../../../providers/RecipeProvider', () => ({
  useRecipeContext: vi.fn(),
}))

vi.mock('../../../providers/AppStateProvider', () => ({
  useAppState: vi.fn(),
}))

vi.mock('../../../components/ItemForm/index.styled', () => ({
  FormContainer: ({ children }: any) => <div>{children}</div>,
  FormCard: ({ children }: any) => <div>{children}</div>,
  FormContent: ({ children }: any) => <div>{children}</div>,
  FormFieldsContainer: ({ children }: any) => <div>{children}</div>,
}))

const mockAddMealPlan = vi.fn()

const exampleRecipes = [
  { id: 'recipe-1', name: 'Pasta', projectId: 'proj-1', ingredients: [], instructions: [], createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: 'recipe-2', name: 'Pizza', projectId: 'proj-1', ingredients: [], instructions: [], createdAt: '2026-01-01', updatedAt: '2026-01-01' },
]

beforeEach(() => {
  vi.clearAllMocks()
  ;(useMealPlanContext as Mock).mockReturnValue({ addMealPlan: mockAddMealPlan })
  ;(useRecipeContext as Mock).mockReturnValue({ recipes: exampleRecipes })
  ;(useAppState as Mock).mockReturnValue({
    state: { selectedCalendarDate: '2026-06-15' },
    dispatch: vi.fn(),
  })
})

describe('Given the MealForm component', () => {
  it('should render the date field pre-filled with selectedCalendarDate', () => {
    render(<MealForm />)
    expect(screen.getByDisplayValue('2026-06-15')).toBeVisible()
  })

  it('should render the From Recipe and Custom Name toggle buttons', () => {
    render(<MealForm />)
    expect(screen.getByRole('button', { name: /from recipe/i })).toBeVisible()
    expect(screen.getByRole('button', { name: /custom name/i })).toBeVisible()
  })

  it('should show recipe list in recipe mode', () => {
    render(<MealForm />)
    expect(screen.getByText('Pasta')).toBeVisible()
    expect(screen.getByText('Pizza')).toBeVisible()
  })

  it('should show search field in recipe mode', () => {
    render(<MealForm />)
    expect(screen.getByPlaceholderText(/search recipes/i)).toBeVisible()
  })

  it('should filter recipes by search input', () => {
    render(<MealForm />)
    fireEvent.change(screen.getByPlaceholderText(/search recipes/i), { target: { value: 'past' } })
    expect(screen.getByText('Pasta')).toBeVisible()
    expect(screen.queryByText('Pizza')).not.toBeInTheDocument()
  })

  it('should show no recipes found when search has no match', () => {
    render(<MealForm />)
    fireEvent.change(screen.getByPlaceholderText(/search recipes/i), { target: { value: 'xyz' } })
    expect(screen.getByText(/no recipes found/i)).toBeVisible()
  })

  it('should show custom name field when Custom Name mode is selected', () => {
    render(<MealForm />)
    fireEvent.click(screen.getByRole('button', { name: /custom name/i }))
    expect(screen.getByLabelText(/meal name/i)).toBeVisible()
  })

  it('should have Add Meal button disabled when nothing is selected in recipe mode', () => {
    render(<MealForm />)
    expect(screen.getByRole('button', { name: /add meal/i })).toBeDisabled()
  })

  it('should enable Add Meal button after selecting a recipe', () => {
    render(<MealForm />)
    fireEvent.click(screen.getByText('Pasta'))
    expect(screen.getByRole('button', { name: /add meal/i })).not.toBeDisabled()
  })

  it('should have Add Meal button disabled in custom mode when name is empty', () => {
    render(<MealForm />)
    fireEvent.click(screen.getByRole('button', { name: /custom name/i }))
    expect(screen.getByRole('button', { name: /add meal/i })).toBeDisabled()
  })

  it('should enable Add Meal button in custom mode when name is filled', () => {
    render(<MealForm />)
    fireEvent.click(screen.getByRole('button', { name: /custom name/i }))
    fireEvent.change(screen.getByLabelText(/meal name/i), { target: { value: 'Tacos' } })
    expect(screen.getByRole('button', { name: /add meal/i })).not.toBeDisabled()
  })

  it('should call addMealPlan with recipe name and id on submit in recipe mode', async () => {
    mockAddMealPlan.mockResolvedValue(undefined)
    render(<MealForm />)
    fireEvent.click(screen.getByText('Pasta'))
    fireEvent.click(screen.getByRole('button', { name: /add meal/i }))
    await waitFor(() => expect(mockAddMealPlan).toHaveBeenCalledWith(
      '2026-06-15',
      'Pasta',
      'recipe-1',
      expect.any(String),
      undefined,
      false
    ))
  })

  it('should call addMealPlan with custom name and undefined recipeId in custom mode', async () => {
    mockAddMealPlan.mockResolvedValue(undefined)
    render(<MealForm />)
    fireEvent.click(screen.getByRole('button', { name: /custom name/i }))
    fireEvent.change(screen.getByLabelText(/meal name/i), { target: { value: 'Tacos' } })
    fireEvent.click(screen.getByRole('button', { name: /add meal/i }))
    await waitFor(() => expect(mockAddMealPlan).toHaveBeenCalledWith(
      '2026-06-15',
      'Tacos',
      undefined,
      expect.any(String),
      undefined,
      false
    ))
  })

  it('should navigate to Planner after successful submit', async () => {
    mockAddMealPlan.mockResolvedValue(undefined)
    render(<MealForm />)
    fireEvent.click(screen.getByText('Pasta'))
    fireEvent.click(screen.getByRole('button', { name: /add meal/i }))
    await waitFor(() => expect(mockNavigate).toHaveBeenCalled())
  })

  it('should show error when addMealPlan rejects', async () => {
    mockAddMealPlan.mockRejectedValue(new Error('Network error'))
    render(<MealForm />)
    fireEvent.click(screen.getByText('Pasta'))
    fireEvent.click(screen.getByRole('button', { name: /add meal/i }))
    expect(await screen.findByText('Network error')).toBeVisible()
  })

  it('should show no recipes yet when recipe list is empty', () => {
    ;(useRecipeContext as Mock).mockReturnValue({ recipes: [] })
    render(<MealForm />)
    expect(screen.getByText(/no recipes yet/i)).toBeVisible()
  })

  it('should use today as default date when selectedCalendarDate is null', () => {
    ;(useAppState as Mock).mockReturnValue({
      state: { selectedCalendarDate: null },
      dispatch: vi.fn(),
    })
    render(<MealForm />)
    const input = screen.getByDisplayValue(/^\d{4}-\d{2}-\d{2}$/)
    expect(input).toBeVisible()
  })
})
