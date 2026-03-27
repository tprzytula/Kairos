import { useMemo } from 'react'
import { Box, Typography, Skeleton } from '@mui/material'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import { COLORS } from '../../constants/colors'
import { IRecipe } from '../../types/recipe'
import { MealType } from '../../enums/mealType'
import { RecipeDishType } from '../../enums/recipeDishType'
import { useRecipeContext } from '../../providers/RecipeProvider'
import RecipeItem from '../RecipeItem'
import {
  RecipeListContainer,
  EmptyStateContainer,
  NoMatchContainer,
  RecipeGrid,
} from './index.styled'

interface RecipeListProps {
  search?: string
  onViewRecipe: (recipe: IRecipe) => void
  selectedMealTypes: MealType[]
  selectedDishTypes: RecipeDishType[]
}

const RecipeSkeletonCard = () => (
  <Box sx={{ borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
    <Skeleton variant="rectangular" sx={{ width: '100%', aspectRatio: '4 / 3' }} />
    <Box sx={{ padding: '0.625rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      <Skeleton variant="text" width="80%" height={20} />
      <Box sx={{ display: 'flex', gap: '0.3rem' }}>
        <Skeleton variant="rounded" width={75} height={20} />
        <Skeleton variant="rounded" width={50} height={20} />
      </Box>
    </Box>
  </Box>
)

const RecipeList = ({ search = '', onViewRecipe, selectedMealTypes, selectedDishTypes }: RecipeListProps) => {
  const { recipes, isLoading } = useRecipeContext()

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
      {isLoading ? (
        <RecipeGrid>
          <RecipeSkeletonCard />
          <RecipeSkeletonCard />
          <RecipeSkeletonCard />
          <RecipeSkeletonCard />
        </RecipeGrid>
      ) : recipes.length === 0 ? (
        <EmptyStateContainer>
          <MenuBookIcon sx={{ fontSize: '3rem', color: COLORS.purple.muted }} />
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
    </RecipeListContainer>
  )
}

export default RecipeList
