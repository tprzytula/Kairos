import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RecipeItem from './index'
import { useProjectContext } from '../../providers/ProjectProvider'
import { useShopContext } from '../../providers/ShopProvider'
import { useAppState } from '../../providers/AppStateProvider'
import { addGroceryItems } from '../../api/groceryList'
import { showAlert } from '../../utils/alert'
import { IRecipe } from '../../types/recipe'
import { GroceryItemUnit } from '../../enums/groceryItem'

jest.mock('../../providers/ProjectProvider', () => ({
  useProjectContext: jest.fn(),
}))

jest.mock('../../providers/ShopProvider', () => ({
  useShopContext: jest.fn(),
}))

jest.mock('../../providers/AppStateProvider', () => ({
  useAppState: jest.fn(),
}))

jest.mock('../../api/groceryList', () => ({
  addGroceryItems: jest.fn(),
}))

jest.mock('../../utils/alert', () => ({
  showAlert: jest.fn(),
}))

jest.mock('../ItemForm/components/ItemImage/utils', () => ({
  findItemIcon: jest.fn(() => undefined),
}))

const mockDispatch = jest.fn()
const mockOnEdit = jest.fn()
const mockOnUseRecipe = jest.fn()

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

const exampleShop = { id: 'shop-1', name: 'Supermarket', icon: '' }

beforeEach(() => {
  jest.clearAllMocks()
  ;(useProjectContext as jest.Mock).mockReturnValue({
    currentProject: { id: 'proj-1', name: 'My Project' },
  })
  ;(useShopContext as jest.Mock).mockReturnValue({ shops: [exampleShop] })
  ;(useAppState as jest.Mock).mockReturnValue({ dispatch: mockDispatch })
})

describe('Given the RecipeItem component', () => {
  it('should render the recipe name', () => {
    render(<RecipeItem recipe={exampleRecipe} onEdit={mockOnEdit} onUseRecipe={mockOnUseRecipe} shopId="shop-1" />)
    expect(screen.getByText('Pasta')).toBeVisible()
  })

  it('should render ingredient count chip', () => {
    render(<RecipeItem recipe={exampleRecipe} onEdit={mockOnEdit} onUseRecipe={mockOnUseRecipe} shopId="shop-1" />)
    expect(screen.getByText(/2 ingredients/i)).toBeVisible()
  })

  it('should render instructions count chip', () => {
    render(<RecipeItem recipe={exampleRecipe} onEdit={mockOnEdit} onUseRecipe={mockOnUseRecipe} shopId="shop-1" />)
    expect(screen.getByText(/2 steps/i)).toBeVisible()
  })

  it('should render Use Recipe button', () => {
    render(<RecipeItem recipe={exampleRecipe} onEdit={mockOnEdit} onUseRecipe={mockOnUseRecipe} shopId="shop-1" />)
    expect(screen.getByRole('button', { name: /use recipe/i })).toBeVisible()
  })

  it('should call onEdit when card tap area is clicked', () => {
    render(<RecipeItem recipe={exampleRecipe} onEdit={mockOnEdit} onUseRecipe={mockOnUseRecipe} shopId="shop-1" />)
    fireEvent.click(screen.getByText('Pasta'))
    expect(mockOnEdit).toHaveBeenCalledWith(exampleRecipe)
  })

  it('should not render ingredients by default in compact view', () => {
    render(<RecipeItem recipe={exampleRecipe} onEdit={mockOnEdit} onUseRecipe={mockOnUseRecipe} shopId="shop-1" />)
    expect(screen.queryByText(/Eggs/)).not.toBeInTheDocument()
  })

  it('should show ingredients when Use Recipe is clicked', () => {
    render(<RecipeItem recipe={exampleRecipe} onEdit={mockOnEdit} onUseRecipe={mockOnUseRecipe} shopId="shop-1" />)
    fireEvent.click(screen.getByRole('button', { name: /use recipe/i }))
    expect(screen.getByText(/Pasta — 200/)).toBeVisible()
    expect(screen.getByText(/Eggs — 2/)).toBeVisible()
  })

  it('should not render instructions toggle in compact view', () => {
    render(<RecipeItem recipe={exampleRecipe} onEdit={mockOnEdit} onUseRecipe={mockOnUseRecipe} shopId="shop-1" />)
    expect(screen.queryByRole('button', { name: /show instructions/i })).not.toBeInTheDocument()
  })

  describe('When shopId is provided', () => {
    it('should enter ingredient selection mode when Use Recipe is clicked', () => {
      render(<RecipeItem recipe={exampleRecipe} onEdit={mockOnEdit} onUseRecipe={mockOnUseRecipe} shopId="shop-1" />)
      fireEvent.click(screen.getByRole('button', { name: /use recipe/i }))
      expect(screen.getByRole('button', { name: /add to list/i })).toBeVisible()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeVisible()
    })

    it('should exit selection mode when Cancel is clicked', () => {
      render(<RecipeItem recipe={exampleRecipe} onEdit={mockOnEdit} onUseRecipe={mockOnUseRecipe} shopId="shop-1" />)
      fireEvent.click(screen.getByRole('button', { name: /use recipe/i }))
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
      expect(screen.getByRole('button', { name: /use recipe/i })).toBeVisible()
    })

    it('should call addGroceryItems with all ingredients on Add to List', async () => {
      ;(addGroceryItems as jest.Mock).mockResolvedValue(undefined)
      render(<RecipeItem recipe={exampleRecipe} onEdit={mockOnEdit} onUseRecipe={mockOnUseRecipe} shopId="shop-1" />)
      fireEvent.click(screen.getByRole('button', { name: /use recipe/i }))
      fireEvent.click(screen.getByRole('button', { name: /add to list/i }))
      await waitFor(() => expect(addGroceryItems).toHaveBeenCalledTimes(1))
      expect(addGroceryItems).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ name: 'Pasta', quantity: 200 }),
          expect.objectContaining({ name: 'Eggs', quantity: 2 }),
        ]),
        'proj-1'
      )
      expect(mockOnUseRecipe).toHaveBeenCalled()
    })

    it('should show success alert after adding ingredients', async () => {
      ;(addGroceryItems as jest.Mock).mockResolvedValue(undefined)
      render(<RecipeItem recipe={exampleRecipe} onEdit={mockOnEdit} onUseRecipe={mockOnUseRecipe} shopId="shop-1" />)
      fireEvent.click(screen.getByRole('button', { name: /use recipe/i }))
      fireEvent.click(screen.getByRole('button', { name: /add to list/i }))
      await waitFor(() => expect(showAlert).toHaveBeenCalledWith(
        expect.objectContaining({ severity: 'success' }),
        mockDispatch
      ))
    })

    it('should show error alert when addGroceryItems fails', async () => {
      ;(addGroceryItems as jest.Mock).mockRejectedValue(new Error('Failed'))
      render(<RecipeItem recipe={exampleRecipe} onEdit={mockOnEdit} onUseRecipe={mockOnUseRecipe} shopId="shop-1" />)
      fireEvent.click(screen.getByRole('button', { name: /use recipe/i }))
      fireEvent.click(screen.getByRole('button', { name: /add to list/i }))
      await waitFor(() => expect(showAlert).toHaveBeenCalledWith(
        expect.objectContaining({ severity: 'error' }),
        mockDispatch
      ))
    })
  })

  describe('When shopId is "all" (needs shop selection)', () => {
    it('should show shop selector when Use Recipe is clicked', () => {
      render(<RecipeItem recipe={exampleRecipe} onEdit={mockOnEdit} onUseRecipe={mockOnUseRecipe} shopId="all" />)
      fireEvent.click(screen.getByRole('button', { name: /use recipe/i }))
      expect(screen.getByRole('button', { name: /continue/i })).toBeVisible()
    })

    it('should have Continue disabled when no shop is selected', () => {
      render(<RecipeItem recipe={exampleRecipe} onEdit={mockOnEdit} onUseRecipe={mockOnUseRecipe} shopId="all" />)
      fireEvent.click(screen.getByRole('button', { name: /use recipe/i }))
      expect(screen.getByRole('button', { name: /continue/i })).toBeDisabled()
    })

    it('should cancel shop selection and return to default state', () => {
      render(<RecipeItem recipe={exampleRecipe} onEdit={mockOnEdit} onUseRecipe={mockOnUseRecipe} shopId="all" />)
      fireEvent.click(screen.getByRole('button', { name: /use recipe/i }))
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
      expect(screen.getByRole('button', { name: /use recipe/i })).toBeVisible()
    })
  })

  describe('When no shops are available', () => {
    it('should render Use Recipe button as disabled', () => {
      ;(useShopContext as jest.Mock).mockReturnValue({ shops: [] })
      render(<RecipeItem recipe={exampleRecipe} onEdit={mockOnEdit} onUseRecipe={mockOnUseRecipe} />)
      expect(screen.getByRole('button', { name: /use recipe/i })).toBeDisabled()
    })
  })

  describe('When recipe has no image', () => {
    it('should render the first letter of the recipe name as placeholder', () => {
      render(<RecipeItem recipe={exampleRecipe} onEdit={mockOnEdit} onUseRecipe={mockOnUseRecipe} shopId="shop-1" />)
      expect(screen.getByText('P')).toBeVisible()
    })
  })

  describe('When recipe has an external link', () => {
    it('should render the external link button', () => {
      const recipeWithLink = { ...exampleRecipe, externalLink: 'https://example.com' }
      render(<RecipeItem recipe={recipeWithLink} onEdit={mockOnEdit} onUseRecipe={mockOnUseRecipe} shopId="shop-1" />)
      expect(screen.getByRole('link')).toBeVisible()
    })
  })
})
