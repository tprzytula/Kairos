import { Box, Typography } from '@mui/material'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import { IRecipe } from '../../types/recipe'
import { IItemDefault } from '../../hooks/useItemDefaults/types'
import { useRecipeContext } from '../../providers/RecipeProvider'
import RecipeItem from '../RecipeItem'

interface RecipeListProps {
  onEditRecipe: (recipe: IRecipe) => void
  onUseRecipe: () => void
  shopId?: string
  defaults?: IItemDefault[]
}

const RecipeList = ({ onEditRecipe, onUseRecipe, shopId, defaults }: RecipeListProps) => {
  const { recipes, isLoading } = useRecipeContext()

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Typography color="text.secondary">Loading recipes...</Typography>
      </Box>
    )
  }

  if (recipes.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 6,
          gap: 1.5,
        }}
      >
        <MenuBookIcon sx={{ fontSize: '3rem', color: 'rgba(102, 126, 234, 0.4)' }} />
        <Typography variant="body1" fontWeight={600} color="text.secondary">
          No recipes yet
        </Typography>
        <Typography variant="body2" color="text.disabled" textAlign="center">
          Add your first recipe using the + button above
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {recipes.map((recipe) => (
        <RecipeItem
          key={recipe.id}
          recipe={recipe}
          onEdit={onEditRecipe}
          onUseRecipe={onUseRecipe}
          shopId={shopId}
          defaults={defaults}
        />
      ))}
    </Box>
  )
}

export default RecipeList
