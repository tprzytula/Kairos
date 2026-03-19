import { useState, useCallback, useRef } from 'react'
import { Typography, Button, Chip, Tooltip, Box, Checkbox, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { IRecipe } from '../../types/recipe'
import { IItemDefault } from '../../hooks/useItemDefaults/types'
import { findItemIcon } from '../ItemForm/components/ItemImage/utils'

const GENERIC_ITEM_NAME = 'generic'
import { GroceryItemUnitLabelMap } from '../../enums/groceryItem'
import { useProjectContext } from '../../providers/ProjectProvider'
import { useShopContext } from '../../providers/ShopProvider'
import { addGroceryItems } from '../../api/groceryList'
import { useAppState } from '../../providers/AppStateProvider'
import { showAlert } from '../../utils/alert'
import {
  RecipeCard,
  RecipeCardTapArea,
  RecipeCardBody,
  RecipeCardHeader,
  RecipeThumbnail,
  RecipePlaceholder,
  RecipeInteractiveArea,
  IngredientList,
  IngredientIcon,
  SelectableIngredientRow,
} from './index.styled'

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
  const interactiveSectionRef = useRef<HTMLDivElement>(null)
  const needsShopSelection = !shopId || shopId === 'all'
  const canUseRecipe = !needsShopSelection || shops.length > 0

  const isExpanded = isSelectingIngredients || isSelectingShop

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
    setTimeout(() => {
      interactiveSectionRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' })
    }, 50)
  }, [localShopId])

  const handleClickUseRecipe = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (needsShopSelection) {
      setIsSelectingShop(true)
    } else {
      setIsSelectingIngredients(true)
    }
    setTimeout(() => {
      interactiveSectionRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' })
    }, 50)
  }, [needsShopSelection])

  const handleUseRecipe = useCallback(async () => {
    const effectiveShopId = localShopId || shopId
    if (!currentProject || !effectiveShopId || effectiveShopId === 'all') return

    const ingredientsToAdd = recipe.ingredients.filter((_, i) => !deselectedIndices.has(i))

    setIsAdding(true)
    try {
      if (ingredientsToAdd.length > 0) {
        await addGroceryItems(
          ingredientsToAdd.map((ingredient) => ({
            name: ingredient.name,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            shopId: effectiveShopId,
            imagePath: findItemIcon(ingredient.name, defaults) || findItemIcon(GENERIC_ITEM_NAME, defaults) || '',
          })),
          currentProject.id
        )
      }
      showAlert({ description: `${recipe.name} ingredients added to your list!`, severity: 'success' }, dispatch)
      setIsSelectingIngredients(false)
      setDeselectedIndices(new Set())
      setLocalShopId(undefined)
      onUseRecipe()
    } catch (error) {
      showAlert({ description: 'Failed to add ingredients', severity: 'error' }, dispatch)
      onUseRecipe()
    } finally {
      setIsAdding(false)
    }
  }, [currentProject, shopId, localShopId, recipe, deselectedIndices, dispatch, onUseRecipe, defaults])

  const placeholderSeed = recipe.name.charCodeAt(0)

  return (
    <RecipeCard>
      <RecipeCardTapArea onClick={() => !isExpanded && onEdit(recipe)}>
        {recipe.imagePath ? (
          <RecipeThumbnail src={recipe.imagePath} alt={recipe.name} />
        ) : (
          <RecipePlaceholder seed={placeholderSeed}>
            <Typography
              sx={{
                fontSize: '1.75rem',
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
            <Typography
              variant="body1"
              fontWeight={600}
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
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
                  sx={{ color: '#f97316', padding: '2px', flexShrink: 0 }}
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
                background: 'rgba(249, 115, 22, 0.1)',
                color: '#f97316',
                fontWeight: 500,
                fontSize: '0.7rem',
                height: '22px',
              }}
            />
            {recipe.instructions && recipe.instructions.length > 0 && (
              <Chip
                label={`${recipe.instructions.length} step${recipe.instructions.length !== 1 ? 's' : ''}`}
                size="small"
                sx={{
                  background: 'rgba(244, 63, 94, 0.1)',
                  color: '#f43f5e',
                  fontWeight: 500,
                  fontSize: '0.7rem',
                  height: '22px',
                }}
              />
            )}
          </Box>
          {!isExpanded && (
            <Tooltip title={canUseRecipe ? 'Select ingredients to add to your list' : 'No shops available'}>
              <span>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddShoppingCartIcon sx={{ fontSize: '0.875rem !important' }} />}
                  onClick={handleClickUseRecipe}
                  disabled={!canUseRecipe}
                  sx={{
                    borderRadius: '6px',
                    background: 'linear-gradient(135deg, #f97316 0%, #f43f5e 100%)',
                    boxShadow: 'none',
                    fontSize: '0.72rem',
                    padding: '3px 10px',
                    minHeight: 0,
                    alignSelf: 'flex-start',
                    textTransform: 'none',
                    '&:hover': { boxShadow: '0 4px 12px rgba(249, 115, 22, 0.4)' },
                    '&:disabled': { background: 'rgba(0,0,0,0.12)' },
                  }}
                >
                  Use Recipe
                </Button>
              </span>
            </Tooltip>
          )}
        </RecipeCardBody>
      </RecipeCardTapArea>

      {isExpanded && (
        <RecipeInteractiveArea>
          {isSelectingIngredients && recipe.ingredients.length > 0 && (
            <IngredientList>
              {recipe.ingredients.map((ingredient, index) => {
                const icon = findItemIcon(ingredient.name, defaults) || findItemIcon(GENERIC_ITEM_NAME, defaults)
                const isDeselected = deselectedIndices.has(index)
                return (
                  <SelectableIngredientRow key={index} isDeselected={isDeselected} onClick={() => handleToggleIngredient(index)}>
                    <Checkbox
                      checked={!isDeselected}
                      size="small"
                      sx={{ padding: '0 4px 0 0', color: '#f97316', '&.Mui-checked': { color: '#f97316' } }}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => handleToggleIngredient(index)}
                    />
                    {icon && <IngredientIcon src={icon} alt={ingredient.name} />}
                    <Typography variant="caption" color="text.secondary">
                      {ingredient.name} — {ingredient.quantity} {GroceryItemUnitLabelMap[ingredient.unit]}
                    </Typography>
                  </SelectableIngredientRow>
                )
              })}
            </IngredientList>
          )}

          <Box ref={interactiveSectionRef}>
            {isSelectingShop ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Select shop</InputLabel>
                  <Select
                    value={localShopId || ''}
                    label="Select shop"
                    onChange={(e) => setLocalShopId(e.target.value as string)}
                  >
                    {shops.map((shop) => (
                      <MenuItem key={shop.id} value={shop.id}>
                        {shop.icon && (
                          <Box component="img" src={shop.icon} alt="" sx={{ width: 20, height: 20, objectFit: 'contain', mr: 1 }} />
                        )}
                        {shop.name}
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
                      background: 'linear-gradient(135deg, #f97316 0%, #f43f5e 100%)',
                      boxShadow: 'none',
                      '&:hover': { boxShadow: '0 4px 12px rgba(249, 115, 22, 0.4)' },
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
                      borderColor: 'rgba(249, 115, 22, 0.4)',
                      color: '#f97316',
                      '&:hover': { borderColor: '#f97316', background: 'rgba(249, 115, 22, 0.05)' },
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : isSelectingIngredients ? (
              <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddShoppingCartIcon />}
                  onClick={handleUseRecipe}
                  disabled={isAdding}
                  sx={{
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #f97316 0%, #f43f5e 100%)',
                    boxShadow: 'none',
                    '&:hover': { boxShadow: '0 4px 12px rgba(249, 115, 22, 0.4)' },
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
                    borderColor: 'rgba(249, 115, 22, 0.4)',
                    color: '#f97316',
                    '&:hover': { borderColor: '#f97316', background: 'rgba(249, 115, 22, 0.05)' },
                  }}
                >
                  Cancel
                </Button>
              </Box>
            ) : null}
          </Box>
        </RecipeInteractiveArea>
      )}
    </RecipeCard>
  )
}

export default RecipeItem
