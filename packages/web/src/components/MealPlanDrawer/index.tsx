import { useState, useEffect, useMemo } from 'react'
import { Drawer, ToggleButton, InputAdornment } from '@mui/material'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import SearchIcon from '@mui/icons-material/Search'
import dayjs from 'dayjs'
import { IMealPlan } from '../../types/mealPlan'
import { useRecipeContext } from '../../providers/RecipeProvider'
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
} from './index.styled'

type Mode = 'recipe' | 'custom'

interface IMealPlanDrawerProps {
  open: boolean
  date: string | null
  mealPlan?: IMealPlan
  onClose: () => void
  onSave: (date: string, recipeName: string, recipeId?: string) => void
  onDelete?: (id: string) => void
}

const MealPlanDrawer = ({ open, date, mealPlan, onClose, onSave, onDelete }: IMealPlanDrawerProps) => {
  const { recipes } = useRecipeContext()
  const [mode, setMode] = useState<Mode>('recipe')
  const [customName, setCustomName] = useState('')
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | undefined>(undefined)
  const [search, setSearch] = useState('')

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
      } else {
        setMode('recipe')
        setCustomName('')
        setSelectedRecipeId(undefined)
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
      onSave(date, selectedRecipe.name, selectedRecipe.id)
    } else if (mode === 'custom' && customName.trim()) {
      onSave(date, customName.trim(), undefined)
    }
  }

  const displayDate = date ? dayjs(date).format('dddd, D MMMM YYYY') : ''

  return (
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
                  <RecipeItem
                    key={recipe.id}
                    selected={selectedRecipeId === recipe.id}
                    onClick={() => setSelectedRecipeId(recipe.id)}
                  >
                    {recipe.name}
                  </RecipeItem>
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
  )
}

export default MealPlanDrawer
