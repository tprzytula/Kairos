import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { Box, Typography, Skeleton, Chip } from '@mui/material'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import SearchIconMui from '@mui/icons-material/Search'
import TuneIcon from '@mui/icons-material/Tune'
import { IRecipe } from '../../types/recipe'
import { MealType, MEAL_TYPE_ORDER } from '../../enums/mealType'
import { RecipeDishType } from '../../enums/recipeDishType'
import { useRecipeContext } from '../../providers/RecipeProvider'
import RecipeItem from '../RecipeItem'
import RecipeFilterSheet from '../RecipeFilterSheet'
import {
  RecipeListContainer,
  SearchContainer,
  SearchIcon,
  SearchInput,
  EmptyStateContainer,
  NoMatchContainer,
  FilterChipsContainer,
  RecipeGrid,
  FilterButton,
  FilterBadge,
  StickyHeader,
} from './index.styled'

interface RecipeListProps {
  onViewRecipe: (recipe: IRecipe) => void
}

const RecipeSkeletonCard = () => (
  <Box sx={{ borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
    <Skeleton variant="rectangular" sx={{ width: '100%', aspectRatio: '4 / 5' }} />
    <Box sx={{ padding: '0.625rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      <Skeleton variant="text" width="80%" height={20} />
      <Box sx={{ display: 'flex', gap: '0.3rem' }}>
        <Skeleton variant="rounded" width={75} height={20} />
        <Skeleton variant="rounded" width={50} height={20} />
      </Box>
    </Box>
  </Box>
)

const RecipeList = ({ onViewRecipe }: RecipeListProps) => {
  const { recipes, isLoading } = useRecipeContext()
  const [search, setSearch] = useState('')
  const [selectedMealTypes, setSelectedMealTypes] = useState<MealType[]>([])
  const [selectedDishTypes, setSelectedDishTypes] = useState<RecipeDishType[]>([])
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)
  const [isStuck, setIsStuck] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

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

  const clearAllFilters = useCallback(() => {
    setSelectedMealTypes([])
    setSelectedDishTypes([])
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
  const dishTypeFilterCount = selectedDishTypes.length

  return (
    <RecipeListContainer>
      <div ref={sentinelRef} />
      <StickyHeader className={isStuck ? 'stuck' : ''}>
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
          <FilterButton onClick={() => setIsFilterSheetOpen(true)} aria-label="More filters">
            <TuneIcon />
            {dishTypeFilterCount > 0 && <FilterBadge>{dishTypeFilterCount}</FilterBadge>}
          </FilterButton>
        </FilterChipsContainer>
      </StickyHeader>

      {isLoading ? (
        <RecipeGrid>
          <RecipeSkeletonCard />
          <RecipeSkeletonCard />
          <RecipeSkeletonCard />
          <RecipeSkeletonCard />
        </RecipeGrid>
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
        <RecipeGrid>
          {filtered.map((recipe) => (
            <RecipeItem
              key={recipe.id}
              recipe={recipe}
              onView={onViewRecipe}
            />
          ))}
        </RecipeGrid>
      )}

      <RecipeFilterSheet
        open={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        selectedMealTypes={selectedMealTypes}
        selectedDishTypes={selectedDishTypes}
        onToggleMealType={toggleMealType}
        onToggleDishType={toggleDishType}
        onClearAll={clearAllFilters}
      />
    </RecipeListContainer>
  )
}

export default RecipeList
