import { useState, useEffect, useMemo } from 'react'
import { Drawer, ToggleButton, InputAdornment, Dialog, DialogContent, DialogTitle, IconButton, Box, Typography, MenuItem } from '@mui/material'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import SearchIcon from '@mui/icons-material/Search'
import VisibilityIcon from '@mui/icons-material/Visibility'
import dayjs from 'dayjs'
import { IMealPlan } from '../../types/mealPlan'
import { IRecipe } from '../../types/recipe'
import { MealType, MEAL_TYPE_ORDER } from '../../enums/mealType'
import { useRecipeContext } from '../../providers/RecipeProvider'
import { GroceryItemUnitLabelMap } from '../../enums/groceryItem'
import {
  DrawerContent,
  DrawerHeader,
  DateLabel,
  StyledTextField,
  ModeToggle,
  RecipeList,
  RecipeItem,
  SaveButton,
  DeleteButton,
  SearchField,
  RecipeItemRow,
  RecipeThumbnail,
  RecipeThumbnailPlaceholder,
  RecipeItemName,
} from './index.styled'

type Mode = 'recipe' | 'custom'

interface IMealPlanDrawerProps {
  open: boolean
  date: string | null
  mealPlan?: IMealPlan
  onClose: () => void
  onSave: (date: string, recipeName: string, recipeId?: string, mealType?: MealType) => void
  onDelete?: (id: string) => void
}

const MealPlanDrawer = ({ open, date, mealPlan, onClose, onSave, onDelete }: IMealPlanDrawerProps) => {
  const { recipes } = useRecipeContext()
  const [mode, setMode] = useState<Mode>('recipe')
  const [customName, setCustomName] = useState('')
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | undefined>(undefined)
  const [search, setSearch] = useState('')
  const [previewRecipe, setPreviewRecipe] = useState<IRecipe | null>(null)
  const [mealType, setMealType] = useState<MealType>(MealType.Dinner)

  useEffect(() => {
    if (open) {
      if (mealPlan) {
        if (mealPlan.recipeId) {
          setMode('recipe')
          setSelectedRecipeId(mealPlan.recipeId)
          setCustomName('')
        } else {
          setMode('custom')
          setCustomName(mealPlan.recipeName)
          setSelectedRecipeId(undefined)
        }
        setMealType(mealPlan.mealType ?? MealType.Dinner)
      } else {
        setMode('recipe')
        setCustomName('')
        setSelectedRecipeId(undefined)
        setMealType(MealType.Dinner)
      }
      setSearch('')
    }
  }, [open, mealPlan])

  const filteredRecipes = useMemo(
    () => recipes.filter(r => r.name.toLowerCase().includes(search.toLowerCase())),
    [recipes, search]
  )

  const selectedRecipe = useMemo(
    () => recipes.find(r => r.id === selectedRecipeId),
    [recipes, selectedRecipeId]
  )

  const canSave = mode === 'recipe'
    ? selectedRecipeId !== undefined
    : customName.trim().length > 0

  const handleSave = () => {
    if (!date) return

    if (mode === 'recipe' && selectedRecipe) {
      onSave(date, selectedRecipe.name, selectedRecipe.id, mealType)
    } else if (mode === 'custom' && customName.trim()) {
      onSave(date, customName.trim(), undefined, mealType)
    }
  }

  const displayDate = date ? dayjs(date).format('dddd, D MMMM YYYY') : ''

  return (
    <>
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { borderRadius: '16px 16px 0 0', maxHeight: '85vh' } }}
    >
      <DrawerContent>
        <DrawerHeader>
          <RestaurantIcon sx={{ fontSize: '1.1rem', verticalAlign: 'middle', marginRight: '6px' }} />
          {mealPlan ? 'Edit Meal' : 'Add Meal'}
        </DrawerHeader>

        <DateLabel>{displayDate}</DateLabel>

        <StyledTextField
          select
          size="small"
          label="Meal type"
          value={mealType}
          onChange={(e) => setMealType(e.target.value as MealType)}
          fullWidth
        >
          {MEAL_TYPE_ORDER.map(type => (
            <MenuItem key={type} value={type}>{type}</MenuItem>
          ))}
        </StyledTextField>

        <ModeToggle
          value={mode}
          exclusive
          onChange={(_, value) => { if (value) setMode(value) }}
        >
          <ToggleButton value="recipe">From Recipe</ToggleButton>
          <ToggleButton value="custom">Custom Name</ToggleButton>
        </ModeToggle>

        {mode === 'recipe' ? (
          <>
            <SearchField
              size="small"
              placeholder="Search recipes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
            <RecipeList>
              {filteredRecipes.length === 0 ? (
                <RecipeItem sx={{ color: '#9ca3af', fontStyle: 'italic' }}>
                  {search ? 'No recipes found' : 'No recipes yet'}
                </RecipeItem>
              ) : (
                filteredRecipes.map(recipe => (
                  <RecipeItemRow
                    key={recipe.id}
                    selected={selectedRecipeId === recipe.id}
                    onClick={() => setSelectedRecipeId(recipe.id)}
                  >
                    {recipe.imagePath ? (
                      <RecipeThumbnail src={recipe.imagePath} alt={recipe.name} />
                    ) : (
                      <RecipeThumbnailPlaceholder seed={recipe.name.charCodeAt(0)}>
                        {recipe.name.charAt(0).toUpperCase()}
                      </RecipeThumbnailPlaceholder>
                    )}
                    <RecipeItemName>{recipe.name}</RecipeItemName>
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); setPreviewRecipe(recipe) }}
                      sx={{ color: '#9ca3af', flexShrink: 0, '&:hover': { color: '#1d4ed8' } }}
                    >
                      <VisibilityIcon sx={{ fontSize: '1rem' }} />
                    </IconButton>
                  </RecipeItemRow>
                ))
              )}
            </RecipeList>
          </>
        ) : (
          <StyledTextField
            size="small"
            label="Meal name"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            fullWidth
            autoFocus
            onKeyDown={(e) => { if (e.key === 'Enter' && canSave) handleSave() }}
          />
        )}

        <SaveButton
          variant="contained"
          fullWidth
          disabled={!canSave}
          onClick={handleSave}
        >
          Save
        </SaveButton>

        {mealPlan && onDelete && (
          <DeleteButton
            variant="outlined"
            fullWidth
            onClick={() => onDelete(mealPlan.id)}
          >
            Delete
          </DeleteButton>
        )}
      </DrawerContent>
    </Drawer>

    <Dialog
      open={previewRecipe !== null}
      onClose={() => setPreviewRecipe(null)}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: '12px', m: 2 } }}
    >
      {previewRecipe && (
        <>
          <DialogTitle sx={{ pb: 1, fontWeight: 700, color: '#1d4ed8' }}>
            {previewRecipe.name}
          </DialogTitle>
          <DialogContent>
            {previewRecipe.imagePath && (
              <Box
                component="img"
                src={previewRecipe.imagePath}
                alt={previewRecipe.name}
                sx={{ width: '100%', borderRadius: '8px', mb: 2, maxHeight: '200px', objectFit: 'cover', display: 'block' }}
              />
            )}
            {previewRecipe.ingredients.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} mb={0.5}>Ingredients</Typography>
                {previewRecipe.ingredients.map((ing, i) => (
                  <Typography key={i} variant="body2" color="text.secondary">
                    • {ing.name} — {ing.quantity} {GroceryItemUnitLabelMap[ing.unit]}
                  </Typography>
                ))}
              </Box>
            )}
            {previewRecipe.instructions && previewRecipe.instructions.length > 0 && (
              <Box>
                <Typography variant="subtitle2" fontWeight={600} mb={0.5}>Instructions</Typography>
                {previewRecipe.instructions.map((step, i) => (
                  <Typography key={i} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {i + 1}. {step}
                  </Typography>
                ))}
              </Box>
            )}
            {previewRecipe.externalLink && (
              <Box mt={2}>
                <Typography
                  component="a"
                  href={previewRecipe.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="body2"
                  sx={{ color: '#1d4ed8' }}
                >
                  View original recipe ↗
                </Typography>
              </Box>
            )}
          </DialogContent>
        </>
      )}
    </Dialog>
    </>
  )
}

export default MealPlanDrawer
