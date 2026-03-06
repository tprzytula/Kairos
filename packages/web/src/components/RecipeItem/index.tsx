import { useState, useCallback } from 'react'
import { Typography, Button, Chip, Tooltip, Box, Checkbox } from '@mui/material'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { IRecipe } from '../../types/recipe'
import { IItemDefault } from '../../hooks/useItemDefaults/types'
import { findItemIcon } from '../ItemForm/components/ItemImage/utils'
import { GroceryItemUnitLabelMap } from '../../enums/groceryItem'
import { useProjectContext } from '../../providers/ProjectProvider'
import { addGroceryItem } from '../../api/groceryList'
import { useAppState } from '../../providers/AppStateProvider'
import { showAlert } from '../../utils/alert'
import {
  RecipeCard,
  RecipeCardTapArea,
  RecipeCardBody,
  RecipeCardHeader,
  RecipeCoverImage,
  RecipePlaceholder,
  RecipeInteractiveArea,
  IngredientList,
  IngredientItemRow,
  IngredientIcon,
  SelectableIngredientRow,
} from './index.styled'

const INGREDIENTS_PREVIEW_COUNT = 3

interface RecipeItemProps {
  recipe: IRecipe
  onEdit: (recipe: IRecipe) => void
  onUseRecipe: () => void
  shopId?: string
  defaults?: IItemDefault[]
}

const RecipeItem = ({ recipe, onEdit, onUseRecipe, shopId, defaults }: RecipeItemProps) => {
  const { currentProject } = useProjectContext()
  const { dispatch } = useAppState()
  const [isAdding, setIsAdding] = useState(false)
  const [isSelectingIngredients, setIsSelectingIngredients] = useState(false)
  const [deselectedIndices, setDeselectedIndices] = useState<Set<number>>(new Set())
  const [showAllIngredients, setShowAllIngredients] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)

  const handleToggleIngredient = useCallback((index: number) => {
    setDeselectedIndices((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }, [])

  const handleCancelSelection = useCallback(() => {
    setIsSelectingIngredients(false)
    setDeselectedIndices(new Set())
  }, [])

  const handleUseRecipe = useCallback(async () => {
    if (!currentProject || !shopId || shopId === 'all') return

    const ingredientsToAdd = recipe.ingredients.filter((_, i) => !deselectedIndices.has(i))

    setIsAdding(true)
    try {
      if (ingredientsToAdd.length > 0) {
        await Promise.all(
          ingredientsToAdd.map((ingredient) =>
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
      }
      showAlert({ description: `${recipe.name} ingredients added to your list!`, severity: 'success' }, dispatch)
      setIsSelectingIngredients(false)
      setDeselectedIndices(new Set())
      onUseRecipe()
    } catch (error) {
      showAlert({ description: 'Failed to add ingredients', severity: 'error' }, dispatch)
    } finally {
      setIsAdding(false)
    }
  }, [currentProject, shopId, recipe, deselectedIndices, dispatch, onUseRecipe])

  const canUseRecipe = shopId && shopId !== 'all'
  const hasMoreIngredients = recipe.ingredients.length > INGREDIENTS_PREVIEW_COUNT
  const visibleIngredients =
    showAllIngredients || isSelectingIngredients
      ? recipe.ingredients
      : recipe.ingredients.slice(0, INGREDIENTS_PREVIEW_COUNT)
  const placeholderSeed = recipe.name.charCodeAt(0)

  return (
    <RecipeCard>
      <RecipeCardTapArea onClick={() => !isSelectingIngredients && onEdit(recipe)}>
        {recipe.imagePath ? (
          <RecipeCoverImage src={recipe.imagePath} alt={recipe.name} />
        ) : (
          <RecipePlaceholder seed={placeholderSeed}>
            <Typography
              sx={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1,
                userSelect: 'none',
              }}
            >
              {recipe.name.charAt(0).toUpperCase()}
            </Typography>
          </RecipePlaceholder>
        )}
        <RecipeCardBody>
          <RecipeCardHeader>
            <Typography variant="body1" fontWeight={600}>
              {recipe.name}
            </Typography>
          </RecipeCardHeader>
          <Box sx={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <Chip
              label={`${recipe.ingredients.length} ingredient${recipe.ingredients.length !== 1 ? 's' : ''}`}
              size="small"
              sx={{
                background: 'rgba(102, 126, 234, 0.1)',
                color: '#667eea',
                fontWeight: 500,
                fontSize: '0.7rem',
              }}
            />
            {recipe.instructions && recipe.instructions.length > 0 && (
              <Chip
                label={`${recipe.instructions.length} step${recipe.instructions.length !== 1 ? 's' : ''}`}
                size="small"
                sx={{
                  background: 'rgba(118, 75, 162, 0.1)',
                  color: '#764ba2',
                  fontWeight: 500,
                  fontSize: '0.7rem',
                }}
              />
            )}
          </Box>
        </RecipeCardBody>
      </RecipeCardTapArea>

      <RecipeInteractiveArea>
        {recipe.ingredients.length > 0 && (
          <IngredientList>
            {visibleIngredients.map((ingredient, index) => {
              const icon = findItemIcon(ingredient.name, defaults)
              const isDeselected = deselectedIndices.has(index)
              if (isSelectingIngredients) {
                return (
                  <SelectableIngredientRow key={index} isDeselected={isDeselected} onClick={() => handleToggleIngredient(index)}>
                    <Checkbox
                      checked={!isDeselected}
                      size="small"
                      sx={{ padding: '0 4px 0 0', color: '#667eea', '&.Mui-checked': { color: '#667eea' } }}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => handleToggleIngredient(index)}
                    />
                    {icon && <IngredientIcon src={icon} alt={ingredient.name} />}
                    <Typography variant="caption" color="text.secondary">
                      {ingredient.name} — {ingredient.quantity} {GroceryItemUnitLabelMap[ingredient.unit]}
                    </Typography>
                  </SelectableIngredientRow>
                )
              }
              return (
                <IngredientItemRow key={index}>
                  {icon && <IngredientIcon src={icon} alt={ingredient.name} />}
                  <Typography variant="caption" color="text.secondary">
                    {ingredient.name} — {ingredient.quantity} {GroceryItemUnitLabelMap[ingredient.unit]}
                  </Typography>
                </IngredientItemRow>
              )
            })}
            {hasMoreIngredients && !isSelectingIngredients && (
              <Button
                size="small"
                onClick={() => setShowAllIngredients((v) => !v)}
                sx={{ alignSelf: 'flex-start', color: '#667eea', padding: '0 4px', minWidth: 0, fontSize: '0.72rem' }}
                endIcon={showAllIngredients ? <ExpandLessIcon fontSize="inherit" /> : <ExpandMoreIcon fontSize="inherit" />}
              >
                {showAllIngredients ? 'Show less' : `${recipe.ingredients.length - INGREDIENTS_PREVIEW_COUNT} more`}
              </Button>
            )}
          </IngredientList>
        )}

        {recipe.instructions && recipe.instructions.length > 0 && (
          <Box>
            <Button
              size="small"
              onClick={() => setShowInstructions((v) => !v)}
              sx={{
                color: '#667eea',
                padding: '0 4px',
                minWidth: 0,
                fontSize: '0.72rem',
                mb: showInstructions ? 0.75 : 0,
              }}
              endIcon={showInstructions ? <ExpandLessIcon fontSize="inherit" /> : <ExpandMoreIcon fontSize="inherit" />}
            >
              {showInstructions ? 'Hide instructions' : 'Show instructions'}
            </Button>
            {showInstructions && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
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
          </Box>
        )}

        {isSelectingIngredients ? (
          <Box sx={{ display: 'flex', gap: '0.5rem', mt: 0.5 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddShoppingCartIcon />}
              onClick={handleUseRecipe}
              disabled={isAdding}
              sx={{
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: 'none',
                '&:hover': { boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)' },
                '&:disabled': { background: 'rgba(0,0,0,0.12)' },
              }}
            >
              {isAdding ? 'Adding...' : 'Add to List'}
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={handleCancelSelection}
              disabled={isAdding}
              sx={{
                borderRadius: '8px',
                borderColor: 'rgba(102, 126, 234, 0.4)',
                color: '#667eea',
                '&:hover': { borderColor: '#667eea', background: 'rgba(102, 126, 234, 0.05)' },
              }}
            >
              Cancel
            </Button>
          </Box>
        ) : (
          <Tooltip title={canUseRecipe ? `Select ingredients to add to your list` : 'Open a specific shop to use this recipe'}>
            <span>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddShoppingCartIcon />}
                onClick={() => setIsSelectingIngredients(true)}
                disabled={!canUseRecipe}
                sx={{
                  mt: 0.5,
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: 'none',
                  '&:hover': { boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)' },
                  '&:disabled': { background: 'rgba(0,0,0,0.12)' },
                }}
              >
                Use Recipe
              </Button>
            </span>
          </Tooltip>
        )}
      </RecipeInteractiveArea>
    </RecipeCard>
  )
}

export default RecipeItem
