import { useState, useCallback, useMemo } from 'react'
import { Box, Typography, Skeleton, Chip } from '@mui/material'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import SearchIconMui from '@mui/icons-material/Search'
import { IRecipe } from '../../types/recipe'
import { IItemDefault } from '../../hooks/useItemDefaults/types'
import { MealType, MEAL_TYPE_ORDER } from '../../enums/mealType'
import { RecipeDishType, RecipeDishTypeLabelMap, RecipeDishTypeOrder } from '../../enums/recipeDishType'
import { useRecipeContext } from '../../providers/RecipeProvider'
import RecipeItem from '../RecipeItem'
import {
  RecipeListContainer,
  SearchContainer,
  SearchIcon,
  SearchInput,
  EmptyStateContainer,
  NoMatchContainer,
  FilterChipsContainer,
} from './index.styled'

interface RecipeListProps {
  onEditRecipe: (recipe: IRecipe) => void
  onUseRecipe: () => void
  shopId?: string
  defaults?: IItemDefault[]
}

const RecipeSkeletonCard = () => (
  <Box sx={{ borderRadius: '12px', border: '1px solid rgba(249,115,22,0.1)', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem' }}>
    <Skeleton variant="rounded" width={90} height={90} sx={{ flexShrink: 0, borderRadius: '10px' }} />
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
      <Skeleton variant="text" width="70%" height={22} />
      <Box sx={{ display: 'flex', gap: '0.4rem' }}>
        <Skeleton variant="rounded" width={85} height={22} />
        <Skeleton variant="rounded" width={55} height={22} />
      </Box>
      <Skeleton variant="rounded" width={90} height={26} sx={{ mt: '0.1rem' }} />
    </Box>
  </Box>
)

const RecipeList = ({ onEditRecipe, onUseRecipe, shopId, defaults }: RecipeListProps) => {
  const { recipes, isLoading } = useRecipeContext()
  const [search, setSearch] = useState('')
  const [selectedMealTypes, setSelectedMealTypes] = useState<MealType[]>([])
  const [selectedDishTypes, setSelectedDishTypes] = useState<RecipeDishType[]>([])

  const toggleMealType = useCallback((type: MealType) => {
    setSelectedMealTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }, [])

  const toggleDishType = useCallback((type: RecipeDishType) => {
    setSelectedDishTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }, [])

  const filtered = useMemo(() => {
    let result = recipes

    if (search.trim()) {
      const query = search.toLowerCase()
      result = result.filter((r) => r.name.toLowerCase().includes(query))
    }

    if (selectedMealTypes.length > 0) {
      result = result.filter((r) =>
        r.mealTypes?.some((t) => selectedMealTypes.includes(t))
      )
    }

    if (selectedDishTypes.length > 0) {
      result = result.filter((r) =>
        r.dishTypes?.some((t) => selectedDishTypes.includes(t))
      )
    }

    return result
  }, [recipes, search, selectedMealTypes, selectedDishTypes])

  const hasActiveFilters = selectedMealTypes.length > 0 || selectedDishTypes.length > 0

  return (
    <RecipeListContainer>
      <SearchContainer>
        <SearchIcon>
          <SearchIconMui />
        </SearchIcon>
        <SearchInput
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SearchContainer>

      <FilterChipsContainer>
        {MEAL_TYPE_ORDER.filter((t) => t !== MealType.Other).map((type) => (
          <Chip
            key={type}
            label={type}
            size="small"
            variant={selectedMealTypes.includes(type) ? 'filled' : 'outlined'}
            onClick={() => toggleMealType(type)}
            sx={{
              borderRadius: '8px',
              flexShrink: 0,
              ...(selectedMealTypes.includes(type)
                ? { background: 'rgba(249,115,22,0.15)', color: '#ea580c', borderColor: 'rgba(249,115,22,0.3)', fontWeight: 600 }
                : { borderColor: 'rgba(0,0,0,0.12)', color: 'text.secondary' }),
            }}
          />
        ))}
        <Box sx={{ width: '1px', background: 'rgba(0,0,0,0.08)', flexShrink: 0, my: '0.25rem' }} />
        {RecipeDishTypeOrder.map((type) => (
          <Chip
            key={type}
            label={RecipeDishTypeLabelMap[type]}
            size="small"
            variant={selectedDishTypes.includes(type) ? 'filled' : 'outlined'}
            onClick={() => toggleDishType(type)}
            sx={{
              borderRadius: '8px',
              flexShrink: 0,
              ...(selectedDishTypes.includes(type)
                ? { background: 'rgba(249,115,22,0.15)', color: '#ea580c', borderColor: 'rgba(249,115,22,0.3)', fontWeight: 600 }
                : { borderColor: 'rgba(0,0,0,0.12)', color: 'text.secondary' }),
            }}
          />
        ))}
      </FilterChipsContainer>

      {isLoading ? (
        <>
          <RecipeSkeletonCard />
          <RecipeSkeletonCard />
          <RecipeSkeletonCard />
        </>
      ) : recipes.length === 0 ? (
        <EmptyStateContainer>
          <MenuBookIcon sx={{ fontSize: '3rem', color: 'rgba(102, 126, 234, 0.4)' }} />
          <Typography variant="body1" fontWeight={600} color="text.secondary">
            No recipes yet
          </Typography>
          <Typography variant="body2" color="text.disabled" textAlign="center">
            Add your first recipe using the + button above
          </Typography>
        </EmptyStateContainer>
      ) : filtered.length === 0 ? (
        <NoMatchContainer>
          <Typography variant="body2" color="text.secondary">
            {hasActiveFilters
              ? 'No recipes match the selected filters'
              : `No recipes match "${search}"`}
          </Typography>
        </NoMatchContainer>
      ) : (
        filtered.map((recipe) => (
          <RecipeItem
            key={recipe.id}
            recipe={recipe}
            onEdit={onEditRecipe}
            onUseRecipe={onUseRecipe}
            shopId={shopId}
            defaults={defaults}
          />
        ))
      )}
    </RecipeListContainer>
  )
}

export default RecipeList
