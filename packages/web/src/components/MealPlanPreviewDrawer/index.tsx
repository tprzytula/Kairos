import { useState, useCallback, useEffect } from 'react'
import { Box, Checkbox, Chip, IconButton, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import DrawerActionButton from '../DrawerActionButton'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import DeleteIcon from '@mui/icons-material/Delete'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CloseIcon from '@mui/icons-material/Close'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { COLORS } from '../../constants/colors'
import { IMealPlan } from '../../types/mealPlan'
import { IItemDefault } from '../../hooks/useItemDefaults/types'
import { GroceryItemUnitLabelMap } from '../../enums/groceryItem'
import { RecipeDishTypeLabelMap, RecipeDishType } from '../../enums/recipeDishType'
import { findItemIcon } from '../ItemForm/components/ItemImage/utils'
import { addGroceryItems } from '../../api/groceryList'
import { useRecipeContext } from '../../providers/RecipeProvider'
import { useProjectContext } from '../../providers/ProjectProvider'
import { useShopContext } from '../../providers/ShopProvider'
import { useAppState } from '../../providers/AppStateProvider'
import { showAlert } from '../../utils/alert'
import PrivateItemBadge from '../PrivateItemBadge'
import { usePreviewDrawerActions } from '../../hooks/usePreviewDrawerActions'
import DraggableBottomDrawer from '../DraggableBottomDrawer'
import { SECTION_GRADIENTS } from '../../constants/sectionColors'
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
  MealName,
  DateRow,
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

const MEAL_GRADIENT = SECTION_GRADIENTS.recipe
const GENERIC_ITEM_NAME = 'generic'

const formatDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

interface MealPlanPreviewDrawerProps {
  item: IMealPlan | null
  onClose: () => void
  onDelete: (id: string) => void
  defaults?: IItemDefault[]
}

const MealPlanPreviewDrawer = ({ item, onClose, onDelete, defaults }: MealPlanPreviewDrawerProps) => {
  const { recipes } = useRecipeContext()
  const { currentProject } = useProjectContext()
  const { shops } = useShopContext()
  const { dispatch } = useAppState()
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set())
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set())
  const [isAdding, setIsAdding] = useState(false)
  const [selectedShopId, setSelectedShopId] = useState<string>('')
  const [showShopSelector, setShowShopSelector] = useState(false)

  const linkedRecipe = item?.recipeId ? recipes.find(r => r.id === item.recipeId) : undefined

  useEffect(() => {
    setCheckedIngredients(new Set())
    setCheckedSteps(new Set())
    setIsAdding(false)
    setSelectedShopId('')
    setShowShopSelector(false)
  }, [item?.id])

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

  const { handleDelete } = usePreviewDrawerActions({
    item,
    onDelete,
    onClose,
  })

  const handleAddToList = useCallback(async () => {
    if (!linkedRecipe || !currentProject) return

    if (shops.length > 1 && !selectedShopId) {
      setShowShopSelector(true)
      return
    }

    if (!selectedShopId) return

    const ingredientsToAdd = linkedRecipe.ingredients.filter((_, i) => !checkedIngredients.has(i))

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
      showAlert({ description: `${linkedRecipe.name} ingredients added to your list!`, severity: 'success' }, dispatch)
      onClose()
    } catch {
      showAlert({ description: 'Failed to add ingredients', severity: 'error' }, dispatch)
    } finally {
      setIsAdding(false)
    }
  }, [linkedRecipe, currentProject, selectedShopId, shops, checkedIngredients, dispatch, defaults, onClose])

  const heroImage = item?.imagePath ?? linkedRecipe?.imagePath
  const placeholderSeed = item?.recipeName.charCodeAt(0) ?? 0
  const instructions = linkedRecipe?.instructions ?? []
  const needsShopSelector = shops.length > 1 && showShopSelector
  const canAdd = (!needsShopSelector || selectedShopId) && !isAdding

  return (
    <DraggableBottomDrawer
      open={item !== null}
      onClose={onClose}
      paperSx={{ height: 'calc(100% - env(safe-area-inset-top) - 16px)' }}
      dragHandleContent={
        <DrawerHeader>
          <DrawerHeaderLeft>
            <DrawerIconBox gradient={MEAL_GRADIENT}>
              <RestaurantIcon />
            </DrawerIconBox>
            <DrawerTitle gradient={MEAL_GRADIENT}>Meal</DrawerTitle>
          </DrawerHeaderLeft>
          <IconButton size="small" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </IconButton>
        </DrawerHeader>
      }
    >
      <ContentContainer>
        {heroImage ? (
          <HeroImage src={heroImage} alt={item?.recipeName ?? ''} />
        ) : item ? (
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
              {item.recipeName.charAt(0).toUpperCase()}
            </Typography>
          </HeroPlaceholder>
        ) : null}

        {item && (
          <MealName>
            {item.recipeName}
            {item.visibility === 'private' && <PrivateItemBadge />}
          </MealName>
        )}

        {item && (
          <DateRow>
            <CalendarTodayIcon />
            {formatDate(item.date)}
            {item.mealType && (
              <Chip
                label={item.mealType}
                size="small"
                sx={{
                  background: COLORS.purple.bg,
                  color: COLORS.purple.primary,
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  height: '24px',
                  ml: 0.5,
                }}
              />
            )}
          </DateRow>
        )}

        {linkedRecipe?.externalLink && (
          <ExternalLinkRow
            href={linkedRecipe.externalLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <OpenInNewIcon sx={{ fontSize: '0.95rem' }} />
            View original recipe
          </ExternalLinkRow>
        )}

        {linkedRecipe && ((linkedRecipe.mealTypes && linkedRecipe.mealTypes.length > 0) || (linkedRecipe.dishTypes && linkedRecipe.dishTypes.length > 0)) && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
            {linkedRecipe.mealTypes?.map((type) => (
              <Chip
                key={type}
                label={type}
                size="small"
                sx={{
                  background: COLORS.purple.bg,
                  color: COLORS.purple.primary,
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  height: '24px',
                }}
              />
            ))}
            {linkedRecipe.dishTypes?.map((type) => (
              <Chip
                key={type}
                label={RecipeDishTypeLabelMap[type as RecipeDishType] ?? type}
                size="small"
                sx={{
                  background: COLORS.green.bg,
                  color: COLORS.green.primary,
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  height: '24px',
                }}
              />
            ))}
          </Box>
        )}

        {linkedRecipe && linkedRecipe.ingredients.length > 0 && (
          <Box>
            <SectionHeader>
              <SectionLabel>Ingredients</SectionLabel>
              <SectionBadge>{linkedRecipe.ingredients.length}</SectionBadge>
            </SectionHeader>
            <Box sx={{ display: 'flex', flexDirection: 'column', mt: 0.75 }}>
              {linkedRecipe.ingredients.map((ingredient, index) => {
                const icon = findItemIcon(ingredient.name, defaults) || findItemIcon(GENERIC_ITEM_NAME, defaults)
                const isChecked = checkedIngredients.has(index)
                return (
                  <IngredientRow key={index} onClick={() => toggleIngredient(index)} sx={{ cursor: 'pointer' }}>
                    <Checkbox
                      checked={isChecked}
                      size="small"
                      sx={{
                        padding: '4px',
                        color: COLORS.orange.muted,
                        '&.Mui-checked': { color: COLORS.orange.primary },
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
                        color: COLORS.orange.muted,
                        '&.Mui-checked': { color: COLORS.orange.primary },
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
        {linkedRecipe && linkedRecipe.ingredients.length > 0 && (
          <>
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
          </>
        )}
        <DrawerActionButton
          variant="outlined"
          icon={<DeleteIcon />}
          label="Delete from Planner"
          onClick={handleDelete}
          color="error"
        />
      </Footer>
    </DraggableBottomDrawer>
  )
}

export default MealPlanPreviewDrawer
