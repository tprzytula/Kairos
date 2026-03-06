import { useState, useCallback } from 'react'
import { Typography, IconButton, Button, Chip, Tooltip, Box } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import { IRecipe } from '../../types/recipe'
import { IItemDefault } from '../../hooks/useItemDefaults/types'
import { findItemIcon } from '../ItemForm/components/ItemImage/utils'
import { GroceryItemUnitLabelMap } from '../../enums/groceryItem'
import { useRecipeContext } from '../../providers/RecipeProvider'
import { useProjectContext } from '../../providers/ProjectProvider'
import { addGroceryItem } from '../../api/groceryList'
import { useAppState } from '../../providers/AppStateProvider'
import { showAlert } from '../../utils/alert'
import { RecipeCard, RecipeCardHeader, RecipeCardActions, RecipeCoverImage, IngredientList, IngredientItemRow, IngredientIcon } from './index.styled'

interface RecipeItemProps {
  recipe: IRecipe
  onEdit: (recipe: IRecipe) => void
  onUseRecipe: () => void
  shopId?: string
  defaults?: IItemDefault[]
}

const RecipeItem = ({ recipe, onEdit, onUseRecipe, shopId, defaults }: RecipeItemProps) => {
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
      {recipe.imagePath && (
        <RecipeCoverImage src={recipe.imagePath} alt={recipe.name} />
      )}

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

      {recipe.ingredients.length > 0 && (
        <IngredientList>
          {recipe.ingredients.map((ingredient, index) => {
            const icon = findItemIcon(ingredient.name, defaults)
            return (
              <IngredientItemRow key={index}>
                {icon && <IngredientIcon src={icon} alt={ingredient.name} />}
                <Typography variant="caption" color="text.secondary">
                  {ingredient.name} — {ingredient.quantity} {GroceryItemUnitLabelMap[ingredient.unit]}
                </Typography>
              </IngredientItemRow>
            )
          })}
        </IngredientList>
      )}

      {recipe.instructions && recipe.instructions.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          <Typography variant="body2" fontWeight={600} color="text.secondary">
            Instructions
          </Typography>
          {recipe.instructions.map((step, index) => (
            <Box key={index} sx={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <Typography
                variant="caption"
                sx={{
                  minWidth: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'rgba(102, 126, 234, 0.15)',
                  color: '#667eea',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {index + 1}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: '1.4', paddingTop: '2px' }}>
                {step}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

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
