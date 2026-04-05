import { useMemo } from 'react'
import { Typography } from '@mui/material'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import { COLORS } from '../../constants/colors'
import { IRecipe } from '../../types/recipe'
import { MealType } from '../../enums/mealType'
import { RecipeDishType } from '../../enums/recipeDishType'
import { useRecipeContext } from '../../providers/RecipeProvider'
import { shimmerStyles } from '../../utils/styles/shimmer'
import RecipeItem from '../RecipeItem'
import { RecipeCard, RecipeCardBody, RecipeMetaRow } from '../RecipeItem/index.styled'
import {
  RecipeListContainer,
  EmptyStateContainer,
  NoMatchContainer,
  RecipeGrid,
} from './index.styled'

interface RecipeListProps {
  search?: string
  onViewRecipe: (recipe: IRecipe) => void
  selectedMealTypes?: MealType[]
  selectedDishTypes?: RecipeDishType[]
}

const RecipeSkeletonCard = () => (
  <RecipeCard>
    <div style={{ width: '100%', aspectRatio: '4 / 3', ...shimmerStyles }} />
    <RecipeCardBody>
      <div style={{ width: '80%', height: 14, borderRadius: 4, ...shimmerStyles }} />
      <RecipeMetaRow>
        <div style={{ width: 75, height: 20, borderRadius: 16, ...shimmerStyles }} />
      </RecipeMetaRow>
    </RecipeCardBody>
  </RecipeCard>
)

const RecipeList = ({ search = '', onViewRecipe, selectedMealTypes = [], selectedDishTypes = [] }: RecipeListProps) => {
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
