import { useState, useMemo, useCallback } from 'react'
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
  padding: '10px 14px',
  cursor: 'pointer',
  fontSize: '0.9rem',
  fontWeight: 500,
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
  const navigate = useNavigate()

  const today = dayjs().format('YYYY-MM-DD')
  const [date, setDate] = useState(today)
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
  }, [canSave, mode, selectedRecipe, customName, date, addMealPlan, navigate])

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
                      filteredRecipes.map(recipe => (
                        <RecipeItem
                          key={recipe.id}
                          selected={selectedRecipeId === recipe.id}
                          onClick={() => setSelectedRecipeId(recipe.id)}
                        >
                          {recipe.name}
                        </RecipeItem>
                      ))
                    )}
                  </RecipeListBox>
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
