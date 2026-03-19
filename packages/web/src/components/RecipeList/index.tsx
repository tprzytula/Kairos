import { useState } from 'react'
import { Box, Typography, Skeleton } from '@mui/material'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import SearchIconMui from '@mui/icons-material/Search'
import { IRecipe } from '../../types/recipe'
import { IItemDefault } from '../../hooks/useItemDefaults/types'
import { useRecipeContext } from '../../providers/RecipeProvider'
import RecipeItem from '../RecipeItem'
import {
  RecipeListContainer,
  SearchContainer,
  SearchIcon,
  SearchInput,
  EmptyStateContainer,
  NoMatchContainer,
} from './index.styled'

interface RecipeListProps {
  onEditRecipe: (recipe: IRecipe) => void
  onUseRecipe: () => void
  shopId?: string
  defaults?: IItemDefault[]
}

const RecipeSkeletonCard = () => (
  <Box sx={{ borderRadius: '12px', border: '1px solid rgba(102,126,234,0.1)', overflow: 'hidden' }}>
    <Skeleton variant="rectangular" height={110} />
    <Box sx={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Skeleton variant="text" width="55%" height={22} />
      <Skeleton variant="rounded" width={90} height={20} />
    </Box>
    <Box sx={{ padding: '0 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <Skeleton variant="text" width="70%" />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="rounded" width={100} height={30} sx={{ mt: 0.5 }} />
    </Box>
  </Box>
)

const RecipeList = ({ onEditRecipe, onUseRecipe, shopId, defaults }: RecipeListProps) => {
  const { recipes, isLoading } = useRecipeContext()
  const [search, setSearch] = useState('')

  const filtered = search.trim()
    ? recipes.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()))
    : recipes

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
            No recipes match "{search}"
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
