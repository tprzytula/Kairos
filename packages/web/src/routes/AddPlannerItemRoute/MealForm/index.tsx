import { useState, useMemo, useCallback } from 'react'
import { useAppState } from '../../../providers/AppStateProvider'
import {
  Alert,
  CircularProgress,
  Stack,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  InputAdornment,
  MenuItem,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import SearchIcon from '@mui/icons-material/Search'
import { useNavigate } from 'react-router'
import { Route } from '../../../enums/route'
import { MealType, MEAL_TYPE_ORDER } from '../../../enums/mealType'
import { useMealPlanContext } from '../../../providers/MealPlanProvider'
import { useRecipeContext } from '../../../providers/RecipeProvider'
import {
  FormContainer,
  FormCard,
  FormContent,
  FormFieldsContainer,
} from '../../../components/ItemForm/index.styled'
import { Box } from '@mui/material'
import dayjs from 'dayjs'
import { PLACEHOLDER_GRADIENTS } from '../../../constants/placeholderGradients'

type Mode = 'recipe' | 'custom'

const MealTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,251,235,0.95) 100%)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '& fieldset': {
      borderColor: 'rgba(217, 119, 6, 0.2)',
      borderWidth: '1px',
      transition: 'all 0.3s ease',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(217, 119, 6, 0.4)',
      boxShadow: '0 2px 8px rgba(217, 119, 6, 0.1)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#d97706',
      borderWidth: '2px',
      boxShadow: '0 4px 16px rgba(217, 119, 6, 0.2)',
    },
  },
  '& .MuiInputLabel-root': {
    fontWeight: '500',
    '&.Mui-focused': {
      color: '#d97706',
      fontWeight: '600',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '14px 16px',
    fontSize: '0.95rem',
    fontWeight: '500',
  },
})

const MealModeToggle = styled(ToggleButtonGroup)({
  width: '100%',
  gap: '8px',
  '& .MuiToggleButton-root': {
    flex: 1,
    textTransform: 'none',
    fontSize: '0.875rem',
    fontWeight: 600,
    borderRadius: '10px !important',
    border: '1px solid rgba(217, 119, 6, 0.3) !important',
    color: 'rgba(0,0,0,0.5)',
    '&.Mui-selected': {
      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      color: '#92400e',
      borderColor: 'rgba(217, 119, 6, 0.5) !important',
    },
  },
})

const RecipeListBox = styled(Box)({
  maxHeight: '200px',
  overflowY: 'auto',
  border: '1px solid rgba(217, 119, 6, 0.2)',
  borderRadius: '12px',
  backgroundColor: 'rgba(255,255,255,0.9)',
})

const RecipeItem = styled(Box)<{ selected?: boolean }>(({ selected }) => ({
  padding: '8px 12px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  color: selected ? '#92400e' : '#374151',
  backgroundColor: selected ? '#fef3c7' : 'transparent',
  borderBottom: '1px solid rgba(217, 119, 6, 0.08)',
  transition: 'background-color 0.15s ease',
  '&:last-child': {
    borderBottom: 'none',
  },
  '&:hover': {
    backgroundColor: selected ? '#fde68a' : '#fffbeb',
  },
}))

const RecipeThumbnail = styled('img')({
  width: '36px',
  height: '36px',
  borderRadius: '8px',
  objectFit: 'cover',
  flexShrink: 0,
})

const RecipeThumbnailPlaceholder = styled(Box)<{ seed: number }>(({ seed }) => ({
  width: '36px',
  height: '36px',
  borderRadius: '8px',
  background: PLACEHOLDER_GRADIENTS[seed % PLACEHOLDER_GRADIENTS.length],
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.85rem',
  fontWeight: 700,
  color: 'rgba(255,255,255,0.85)',
}))

const RecipeItemName = styled('span')({
  fontSize: '0.9rem',
  fontWeight: 500,
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

// Recipe photo preview card (mirrors TodayMealCard hero style)
const RecipePreview = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '160px',
  borderRadius: '14px',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0,0,0,0.14)',
})

const RecipePreviewImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
})

const RecipePreviewPlaceholder = styled(Box)<{ seed: number }>(({ seed }) => ({
  width: '100%',
  height: '100%',
  background: PLACEHOLDER_GRADIENTS[seed % PLACEHOLDER_GRADIENTS.length],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const RecipePreviewPlaceholderInitial = styled('span')({
  fontSize: '3.5rem',
  fontWeight: 800,
  color: 'rgba(255,255,255,0.6)',
  userSelect: 'none',
  lineHeight: 1,
})

const RecipePreviewOverlay = styled(Box)({
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  padding: '0.875rem 1rem',
  gap: '0.2rem',
})

const RecipePreviewLabel = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '0.3rem',
  fontSize: '0.62rem',
  fontWeight: 700,
  color: 'rgba(255,255,255,0.7)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  '& .MuiSvgIcon-root': {
    fontSize: '0.75rem',
  },
})

const RecipePreviewTitle = styled('div')({
  fontSize: '1.15rem',
  fontWeight: 700,
  color: '#fff',
  lineHeight: '1.25',
  letterSpacing: '-0.01em',
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  textShadow: '0 1px 4px rgba(0,0,0,0.3)',
})

const SubmitButton = styled(Button)({
  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  color: 'white',
  fontWeight: '600',
  fontSize: '1rem',
  padding: '0.875rem 2rem',
  borderRadius: '12px',
  textTransform: 'none',
  boxShadow: '0 4px 16px rgba(217, 119, 6, 0.3)',
  border: 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  minHeight: '48px',
  '&:hover': {
    background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
    boxShadow: '0 6px 24px rgba(217, 119, 6, 0.4)',
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  '&:disabled': {
    background: 'linear-gradient(135deg, rgba(245,158,11,0.4) 0%, rgba(217,119,6,0.4) 100%)',
    color: 'rgba(255,255,255,0.6)',
    boxShadow: 'none',
    transform: 'none',
  },
})

const MealFormCard = styled(FormCard)({
  '&:before': {
    background: 'linear-gradient(90deg, #f59e0b 0%, #d97706 50%, #fbbf24 100%)',
  },
})

const MealForm = () => {
  const { addMealPlan } = useMealPlanContext()
  const { recipes } = useRecipeContext()
  const { state: { selectedCalendarDate } } = useAppState()
  const navigate = useNavigate()

  const [date, setDate] = useState(selectedCalendarDate ?? dayjs().format('YYYY-MM-DD'))
  const [mode, setMode] = useState<Mode>('recipe')
  const [customName, setCustomName] = useState('')
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | undefined>(undefined)
  const [search, setSearch] = useState('')
  const [mealType, setMealType] = useState<MealType>(MealType.Dinner)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const filteredRecipes = useMemo(
    () => recipes.filter(r => r.name.toLowerCase().includes(search.toLowerCase())),
    [recipes, search]
  )

  const selectedRecipe = useMemo(
    () => recipes.find(r => r.id === selectedRecipeId),
    [recipes, selectedRecipeId]
  )

  const canSave = date && (mode === 'recipe' ? selectedRecipeId !== undefined : customName.trim().length > 0)

  const handleSubmit = useCallback(async () => {
    if (!canSave) return
    setError('')
    setIsLoading(true)
    try {
      if (mode === 'recipe' && selectedRecipe) {
        await addMealPlan(date, selectedRecipe.name, selectedRecipe.id, mealType)
      } else if (mode === 'custom' && customName.trim()) {
        await addMealPlan(date, customName.trim(), undefined, mealType)
      }
      navigate(Route.Planner)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save meal')
    } finally {
      setIsLoading(false)
    }
  }, [canSave, mode, selectedRecipe, customName, date, mealType, addMealPlan, navigate])

  return (
    <FormContainer>
      <MealFormCard>
        <FormContent>
          <Stack spacing={2.5}>
            <FormFieldsContainer>
              <MealTextField
                fullWidth
                label="Date"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                disabled={isLoading}
                InputLabelProps={{ shrink: true }}
              />

              <MealTextField
                select
                fullWidth
                label="Meal type"
                value={mealType}
                onChange={e => setMealType(e.target.value as MealType)}
                disabled={isLoading}
              >
                {MEAL_TYPE_ORDER.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </MealTextField>

              <MealModeToggle
                value={mode}
                exclusive
                onChange={(_, value) => { if (value) { setMode(value); setSelectedRecipeId(undefined); setCustomName('') } }}
              >
                <ToggleButton value="recipe">
                  From Recipe
                </ToggleButton>
                <ToggleButton value="custom">
                  Custom Name
                </ToggleButton>
              </MealModeToggle>

              {mode === 'recipe' ? (
                <>
                  <MealTextField
                    size="small"
                    placeholder="Search recipes..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" sx={{ color: '#d97706' }} />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    disabled={isLoading}
                  />
                  <RecipeListBox>
                    {filteredRecipes.length === 0 ? (
                      <RecipeItem sx={{ color: '#9ca3af', fontStyle: 'italic' }}>
                        {search ? 'No recipes found' : 'No recipes yet'}
                      </RecipeItem>
                    ) : (
                      filteredRecipes.map(recipe => {
                        const seed = recipe.name.charCodeAt(0)
                        return (
                          <RecipeItem
                            key={recipe.id}
                            selected={selectedRecipeId === recipe.id}
                            onClick={() => setSelectedRecipeId(recipe.id)}
                          >
                            {recipe.imagePath
                              ? <RecipeThumbnail src={recipe.imagePath} alt={recipe.name} />
                              : (
                                <RecipeThumbnailPlaceholder seed={seed}>
                                  {recipe.name.charAt(0).toUpperCase()}
                                </RecipeThumbnailPlaceholder>
                              )
                            }
                            <RecipeItemName>{recipe.name}</RecipeItemName>
                          </RecipeItem>
                        )
                      })
                    )}
                  </RecipeListBox>

                  {selectedRecipe && (
                    <RecipePreview>
                      {selectedRecipe.imagePath
                        ? <RecipePreviewImage src={selectedRecipe.imagePath} alt={selectedRecipe.name} />
                        : (
                          <RecipePreviewPlaceholder seed={selectedRecipe.name.charCodeAt(0)}>
                            <RecipePreviewPlaceholderInitial>
                              {selectedRecipe.name.charAt(0).toUpperCase()}
                            </RecipePreviewPlaceholderInitial>
                          </RecipePreviewPlaceholder>
                        )
                      }
                      <RecipePreviewOverlay>
                        <RecipePreviewLabel>
                          <RestaurantIcon />
                          {mealType}
                        </RecipePreviewLabel>
                        <RecipePreviewTitle>{selectedRecipe.name}</RecipePreviewTitle>
                      </RecipePreviewOverlay>
                    </RecipePreview>
                  )}
                </>
              ) : (
                <MealTextField
                  fullWidth
                  label="Meal name"
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  disabled={isLoading}
                  autoFocus
                  placeholder="e.g., Pasta, Chicken Salad"
                  onKeyDown={e => { if (e.key === 'Enter' && canSave) handleSubmit() }}
                />
              )}
            </FormFieldsContainer>

            <SubmitButton
              variant="contained"
              disabled={!canSave || isLoading}
              onClick={handleSubmit}
              fullWidth
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <RestaurantIcon />}
            >
              {isLoading ? 'Saving...' : 'Add Meal'}
            </SubmitButton>

            {error && (
              <Alert severity="error" sx={{ borderRadius: '12px' }}>
                {error}
              </Alert>
            )}
          </Stack>
        </FormContent>
      </MealFormCard>
    </FormContainer>
  )
}

export default MealForm
