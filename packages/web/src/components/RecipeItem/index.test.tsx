import { render, screen, fireEvent } from '@testing-library/react'
import RecipeItem from './index'
import { IRecipe } from '../../types/recipe'
import { GroceryItemUnit } from '../../enums/groceryItem'

const mockOnView = vi.fn()

const exampleRecipe: IRecipe = {
  id: 'recipe-1',
  projectId: 'proj-1',
  name: 'Pasta',
  ingredients: [
    { name: 'Pasta', quantity: 200, unit: GroceryItemUnit.GRAM },
    { name: 'Eggs', quantity: 2, unit: GroceryItemUnit.UNIT },
  ],
  instructions: ['Boil water', 'Cook pasta'],
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Given the RecipeItem component', () => {
  it('should render the recipe name', () => {
    render(<RecipeItem recipe={exampleRecipe} onView={mockOnView} />)
    expect(screen.getByText('Pasta')).toBeVisible()
  })

  it('should render ingredient count chip', () => {
    render(<RecipeItem recipe={exampleRecipe} onView={mockOnView} />)
    expect(screen.getByText(/2 ingredients/i)).toBeVisible()
  })

  it('should render instructions count chip', () => {
    render(<RecipeItem recipe={exampleRecipe} onView={mockOnView} />)
    expect(screen.getByText(/2 steps/i)).toBeVisible()
  })

  it('should call onView when card is tapped', () => {
    render(<RecipeItem recipe={exampleRecipe} onView={mockOnView} />)
    fireEvent.click(screen.getByText('Pasta'))
    expect(mockOnView).toHaveBeenCalledWith(exampleRecipe)
  })

  describe('When recipe has no image', () => {
    it('should render the first letter of the recipe name as placeholder', () => {
      render(<RecipeItem recipe={exampleRecipe} onView={mockOnView} />)
      expect(screen.getByText('P')).toBeVisible()
    })
  })

  describe('When recipe has one ingredient', () => {
    it('should render singular ingredient label', () => {
      const singleIngredient: IRecipe = {
        ...exampleRecipe,
        ingredients: [{ name: 'Salt', quantity: 1, unit: GroceryItemUnit.UNIT }],
      }
      render(<RecipeItem recipe={singleIngredient} onView={mockOnView} />)
      expect(screen.getByText(/1 ingredient$/i)).toBeVisible()
    })
  })

  describe('When recipe has no instructions', () => {
    it('should not render steps chip', () => {
      const noSteps: IRecipe = { ...exampleRecipe, instructions: [] }
      render(<RecipeItem recipe={noSteps} onView={mockOnView} />)
      expect(screen.queryByText(/step/i)).not.toBeInTheDocument()
    })
  })
})
