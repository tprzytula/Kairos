import { useState, useCallback } from 'react'
import { Typography, Button, Chip, Tooltip, Box, Checkbox, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { IRecipe } from '../../types/recipe'
import { IItemDefault } from '../../hooks/useItemDefaults/types'
import { findItemIcon } from '../ItemForm/components/ItemImage/utils'
import { GroceryItemUnitLabelMap } from '../../enums/groceryItem'
import { useProjectContext } from '../../providers/ProjectProvider'
import { useShopContext } from '../../providers/ShopProvider'
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
  const { shops } = useShopContext()
  const [isAdding, setIsAdding] = useState(false)
  const [isSelectingIngredients, setIsSelectingIngredients] = useState(false)
  const [isSelectingShop, setIsSelectingShop] = useState(false)
  const [localShopId, setLocalShopId] = useState<string | undefined>(undefined)
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
    setLocalShopId(undefined)
  }, [])

  const handleCancelShopSelection = useCallback(() => {
    setIsSelectingShop(false)
    setLocalShopId(undefined)
  }, [])

  const handleConfirmShopSelection = useCallback(() => {
    if (!localShopId) return
    setIsSelectingShop(false)
    setIsSelectingIngredients(true)
  }, [localShopId])

  const handleUseRecipe = useCallback(async () => {
    const effectiveShopId = localShopId || shopId
    if (!currentProject || !effectiveShopId || effectiveShopId === 'all') return

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
                shopId: effectiveShopId,
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
      setLocalShopId(undefined)
      onUseRecipe()
    } catch (error) {
      showAlert({ description: 'Failed to add ingredients', severity: 'error' }, dispatch)
    } finally {
      setIsAdding(false)
    }
  }, [currentProject, shopId, localShopId, recipe, deselectedIndices, dispatch, onUseRecipe])

  const needsShopSelection = !shopId || shopId === 'all'
  const canUseRecipe = !needsShopSelection || shops.length > 0
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
            {recipe.externalLink && (
              <Tooltip title="View original recipe">
                <IconButton
                  size="small"
                  component="a"
                  href={recipe.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  sx={{ color: '#667eea', padding: '2px' }}
                >
                  <OpenInNewIcon sx={{ fontSize: '1rem' }} />
                </IconButton>
              </Tooltip>
            )}
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

        {isSelectingShop ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', mt: 0.5 }}>
            <FormControl size="small" fullWidth>
              <InputLabel>Select shop</InputLabel>
              <Select
                value={localShopId || ''}
                label="Select shop"
                onChange={(e) => setLocalShopId(e.target.value as string)}
              >
                {shops.map((shop) => (
                  <MenuItem key={shop.id} value={shop.id}>
                    {shop.icon ? `${shop.icon} ` : ''}{shop.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddShoppingCartIcon />}
                onClick={handleConfirmShopSelection}
                disabled={!localShopId}
                sx={{
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: 'none',
                  '&:hover': { boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)' },
                  '&:disabled': { background: 'rgba(0,0,0,0.12)' },
                }}
              >
                Continue
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={handleCancelShopSelection}
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
          </Box>
        ) : isSelectingIngredients ? (
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
          <Tooltip title={canUseRecipe ? `Select ingredients to add to your list` : 'No shops available'}>
            <span>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddShoppingCartIcon />}
                onClick={() => needsShopSelection ? setIsSelectingShop(true) : setIsSelectingIngredients(true)}
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
