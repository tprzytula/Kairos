import { useState, useCallback, useEffect } from 'react'
import { Box, Checkbox, Chip, IconButton, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { IRecipe } from '../../types/recipe'
import { IItemDefault } from '../../hooks/useItemDefaults/types'
import { GroceryItemUnitLabelMap } from '../../enums/groceryItem'
import { RecipeDishTypeLabelMap, RecipeDishType } from '../../enums/recipeDishType'
import { findItemIcon } from '../ItemForm/components/ItemImage/utils'
import { addGroceryItems } from '../../api/groceryList'
import { useProjectContext } from '../../providers/ProjectProvider'
import { useShopContext } from '../../providers/ShopProvider'
import { useAppState } from '../../providers/AppStateProvider'
import { showAlert } from '../../utils/alert'
import { usePreviewDrawerActions } from '../../hooks/usePreviewDrawerActions'
import DraggableBottomDrawer from '../DraggableBottomDrawer'
import DrawerActionButton from '../DrawerActionButton'
import {
  DrawerHeader,
  DrawerHeaderLeft,
  DrawerIconBox,
  DrawerTitle,
  ContentContainer,
} from '../DrawerHeader/index.styled'
import {
  HeroImage,
  HeroPlaceholder,
  RecipeTitle,
  ExternalLinkRow,
  SectionHeader,
  SectionLabel,
  SectionBadge,
  IngredientRow,
  IngredientIcon,
  IngredientQuantity,
  IngredientName,
  StepRow,
  StepNumber,
  StepText,
  Footer,
  ShopSelector,
} from './index.styled'

const GENERIC_ITEM_NAME = 'generic'

interface RecipeViewDrawerProps {
  recipe: IRecipe | null
  onClose: () => void
  onEdit: (recipe: IRecipe) => void
  defaults?: IItemDefault[]
}

const RecipeViewDrawer = ({ recipe, onClose, onEdit, defaults }: RecipeViewDrawerProps) => {
  const { currentProject } = useProjectContext()
  const { shops } = useShopContext()
  const { dispatch } = useAppState()
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set())
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set())
  const [isAdding, setIsAdding] = useState(false)
  const [selectedShopId, setSelectedShopId] = useState<string>('')

  useEffect(() => {
    setCheckedIngredients(new Set())
    setCheckedSteps(new Set())
    setIsAdding(false)
    setSelectedShopId('')
  }, [recipe?.id])

  useEffect(() => {
    if (shops.length === 1) {
      setSelectedShopId(shops[0].id)
    }
  }, [shops])

  const toggleIngredient = useCallback((index: number) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }, [])

  const toggleStep = useCallback((index: number) => {
    setCheckedSteps((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }, [])

  const { handleEdit } = usePreviewDrawerActions({
    item: recipe,
    onEdit,
    onClose,
    closeOnEdit: false,
  })

  const handleAddToList = useCallback(async () => {
    if (!recipe || !currentProject || !selectedShopId) return

    const ingredientsToAdd = recipe.ingredients.filter((_, i) => !checkedIngredients.has(i))

    if (ingredientsToAdd.length === 0) {
      showAlert({ description: 'No ingredients selected', severity: 'warning' }, dispatch)
      return
    }

    setIsAdding(true)
    try {
      await addGroceryItems(
        ingredientsToAdd.map((ingredient) => ({
          name: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          shopId: selectedShopId,
          imagePath: findItemIcon(ingredient.name, defaults) || findItemIcon(GENERIC_ITEM_NAME, defaults) || '',
        })),
        currentProject.id
      )
      showAlert({ description: `${recipe.name} ingredients added to your list!`, severity: 'success' }, dispatch)
      onClose()
    } catch {
      showAlert({ description: 'Failed to add ingredients', severity: 'error' }, dispatch)
    } finally {
      setIsAdding(false)
    }
  }, [recipe, currentProject, selectedShopId, checkedIngredients, dispatch, defaults, onClose])

  const placeholderSeed = recipe?.name.charCodeAt(0) ?? 0
  const instructions = recipe?.instructions ?? []
  const needsShopSelector = shops.length > 1
  const canAdd = selectedShopId && !isAdding

  return (
    <DraggableBottomDrawer
      open={recipe !== null}
      onClose={onClose}
      paperSx={{ height: 'calc(100% - env(safe-area-inset-top) - 16px)' }}
      contentSx={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      dragHandleContent={
        <DrawerHeader>
          <DrawerHeaderLeft>
            <DrawerIconBox>
              <RestaurantIcon />
            </DrawerIconBox>
            <DrawerTitle>{recipe?.name ?? 'Recipe'}</DrawerTitle>
          </DrawerHeaderLeft>
          <IconButton size="small" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </IconButton>
        </DrawerHeader>
      }
    >
      <ContentContainer>
        {recipe?.imagePath ? (
          <HeroImage src={recipe.imagePath} alt={recipe.name} />
        ) : recipe ? (
          <HeroPlaceholder seed={placeholderSeed}>
            <Typography
              sx={{
                fontSize: '3rem',
                fontWeight: 700,
                color: 'rgba(255, 255, 255, 0.85)',
                lineHeight: 1,
                userSelect: 'none',
              }}
            >
              {recipe.name.charAt(0).toUpperCase()}
            </Typography>
          </HeroPlaceholder>
        ) : null}

        {recipe && <RecipeTitle>{recipe.name}</RecipeTitle>}

        {recipe?.externalLink && (
          <ExternalLinkRow
            href={recipe.externalLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <OpenInNewIcon sx={{ fontSize: '0.95rem' }} />
            View original recipe
          </ExternalLinkRow>
        )}

        {recipe && ((recipe.mealTypes && recipe.mealTypes.length > 0) || (recipe.dishTypes && recipe.dishTypes.length > 0)) && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
            {recipe.mealTypes?.map((type) => (
              <Chip
                key={type}
                label={type}
                size="small"
                sx={{
                  background: 'rgba(102, 126, 234, 0.1)',
                  color: '#667ee2',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  height: '24px',
                }}
              />
            ))}
            {recipe.dishTypes?.map((type) => (
              <Chip
                key={type}
                label={RecipeDishTypeLabelMap[type as RecipeDishType] ?? type}
                size="small"
                sx={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#059669',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  height: '24px',
                }}
              />
            ))}
          </Box>
        )}

        {recipe && recipe.ingredients.length > 0 && (
          <Box>
            <SectionHeader>
              <SectionLabel>Ingredients</SectionLabel>
              <SectionBadge>{recipe.ingredients.length}</SectionBadge>
            </SectionHeader>
            <Box sx={{ display: 'flex', flexDirection: 'column', mt: 0.75 }}>
              {recipe.ingredients.map((ingredient, index) => {
                const icon = findItemIcon(ingredient.name, defaults) || findItemIcon(GENERIC_ITEM_NAME, defaults)
                const isChecked = checkedIngredients.has(index)
                return (
                  <IngredientRow key={index} onClick={() => toggleIngredient(index)} sx={{ cursor: 'pointer' }}>
                    <Checkbox
                      checked={isChecked}
                      size="small"
                      sx={{
                        padding: '4px',
                        color: 'rgba(249, 115, 22, 0.4)',
                        '&.Mui-checked': { color: '#f97316' },
                      }}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => toggleIngredient(index)}
                    />
                    {icon && <IngredientIcon src={icon} alt={ingredient.name} />}
                    <IngredientQuantity>
                      {ingredient.quantity} {GroceryItemUnitLabelMap[ingredient.unit]}
                    </IngredientQuantity>
                    <IngredientName checked={isChecked}>
                      {ingredient.name}
                    </IngredientName>
                  </IngredientRow>
                )
              })}
            </Box>
          </Box>
        )}

        {instructions.length > 0 && (
          <Box>
            <SectionHeader>
              <SectionLabel>Steps</SectionLabel>
              <SectionBadge>{instructions.length}</SectionBadge>
            </SectionHeader>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', mt: 0.75 }}>
              {instructions.map((step, index) => {
                const isChecked = checkedSteps.has(index)
                return (
                  <StepRow key={index} onClick={() => toggleStep(index)} sx={{ cursor: 'pointer' }}>
                    <Checkbox
                      checked={isChecked}
                      size="small"
                      sx={{
                        padding: '4px',
                        color: 'rgba(249, 115, 22, 0.4)',
                        '&.Mui-checked': { color: '#f97316' },
                        marginTop: '-2px',
                      }}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => toggleStep(index)}
                    />
                    <StepNumber>{index + 1}</StepNumber>
                    <StepText checked={isChecked}>{step}</StepText>
                  </StepRow>
                )
              })}
            </Box>
          </Box>
        )}
      </ContentContainer>

      <Footer>
        {needsShopSelector && (
          <ShopSelector>
            <FormControl size="small" fullWidth>
              <InputLabel>Select shop</InputLabel>
              <Select
                value={selectedShopId}
                label="Select shop"
                onChange={(e) => setSelectedShopId(e.target.value as string)}
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
          </ShopSelector>
        )}
        <DrawerActionButton
          gradient="linear-gradient(135deg, #f97316 0%, #f43f5e 100%)"
          icon={<AddShoppingCartIcon />}
          label={isAdding ? 'Adding...' : 'Add to Shopping List'}
          onClick={handleAddToList}
          disabled={!canAdd}
        />
        <DrawerActionButton
          gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          icon={<EditIcon />}
          label="Edit Recipe"
          onClick={handleEdit}
        />
      </Footer>
    </DraggableBottomDrawer>
  )
}

export default RecipeViewDrawer
