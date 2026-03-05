import { useState, useCallback } from 'react'
import { Typography, IconButton, Button, Chip, Tooltip } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import { IRecipe } from '../../types/recipe'
import { useRecipeContext } from '../../providers/RecipeProvider'
import { useProjectContext } from '../../providers/ProjectProvider'
import { addGroceryItem } from '../../api/groceryList'
import { useAppState } from '../../providers/AppStateProvider'
import { showAlert } from '../../utils/alert'
import { RecipeCard, RecipeCardHeader, RecipeCardActions } from './index.styled'

interface RecipeItemProps {
  recipe: IRecipe
  onEdit: (recipe: IRecipe) => void
  onUseRecipe: () => void
  shopId?: string
}

const RecipeItem = ({ recipe, onEdit, onUseRecipe, shopId }: RecipeItemProps) => {
  const { removeRecipe } = useRecipeContext()
  const { currentProject } = useProjectContext()
  const { dispatch } = useAppState()
  const [isAdding, setIsAdding] = useState(false)

  const handleUseRecipe = useCallback(async () => {
    if (!currentProject || !shopId || shopId === 'all') return

    setIsAdding(true)
    try {
      await Promise.all(
        recipe.ingredients.map((ingredient) =>
          addGroceryItem(
            {
              name: ingredient.name,
              quantity: ingredient.quantity,
              unit: ingredient.unit,
              shopId,
              imagePath: '',
            },
            currentProject.id
          )
        )
      )
      showAlert({ description: `${recipe.name} ingredients added to your list!`, severity: 'success' }, dispatch)
      onUseRecipe()
    } catch (error) {
      showAlert({ description: 'Failed to add ingredients', severity: 'error' }, dispatch)
    } finally {
      setIsAdding(false)
    }
  }, [currentProject, shopId, recipe, dispatch, onUseRecipe])

  const handleDelete = useCallback(async () => {
    try {
      await removeRecipe(recipe.id)
    } catch (error) {
      showAlert({ description: 'Failed to delete recipe', severity: 'error' }, dispatch)
    }
  }, [recipe.id, removeRecipe, dispatch])

  const canUseRecipe = shopId && shopId !== 'all'

  return (
    <RecipeCard>
      <RecipeCardHeader>
        <Typography variant="body1" fontWeight={600}>
          {recipe.name}
        </Typography>
        <RecipeCardActions>
          <Tooltip title="Edit recipe">
            <IconButton size="small" onClick={() => onEdit(recipe)} aria-label={`Edit ${recipe.name}`}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete recipe">
            <IconButton size="small" onClick={handleDelete} aria-label={`Delete ${recipe.name}`}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </RecipeCardActions>
      </RecipeCardHeader>

      <Chip
        label={`${recipe.ingredients.length} ingredient${recipe.ingredients.length !== 1 ? 's' : ''}`}
        size="small"
        sx={{
          alignSelf: 'flex-start',
          background: 'rgba(102, 126, 234, 0.1)',
          color: '#667eea',
          fontWeight: 500,
          fontSize: '0.7rem',
        }}
      />

      <Tooltip title={canUseRecipe ? `Add all ingredients to current shop's list` : 'Open a specific shop to use this recipe'}>
        <span>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddShoppingCartIcon />}
            onClick={handleUseRecipe}
            disabled={isAdding || !canUseRecipe}
            sx={{
              mt: 0.5,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: 'none',
              '&:hover': { boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)' },
              '&:disabled': { background: 'rgba(0,0,0,0.12)' },
            }}
          >
            {isAdding ? 'Adding...' : 'Use Recipe'}
          </Button>
        </span>
      </Tooltip>
    </RecipeCard>
  )
}

export default RecipeItem
