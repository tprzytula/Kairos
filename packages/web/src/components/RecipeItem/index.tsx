import { Typography } from '@mui/material'
import { IRecipe } from '../../types/recipe'
import {
  RecipeCard,
  RecipeCardTapArea,
  RecipeCardBody,
  RecipeThumbnail,
  RecipePlaceholder,
  RecipeName,
  RecipeMetaRow,
  MetaChip,
} from './index.styled'

interface RecipeItemProps {
  recipe: IRecipe
  onView: (recipe: IRecipe) => void
}

const RecipeItem = ({ recipe, onView }: RecipeItemProps) => {
  const placeholderSeed = recipe.name.charCodeAt(0)

  return (
    <RecipeCard>
      <RecipeCardTapArea onClick={() => onView(recipe)}>
        {recipe.imagePath ? (
          <RecipeThumbnail src={recipe.imagePath} alt={recipe.name} />
        ) : (
          <RecipePlaceholder seed={placeholderSeed}>
            <Typography
              sx={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1,
                userSelect: 'none',
              }}
            >
              {recipe.name.charAt(0).toUpperCase()}
            </Typography>
          </RecipePlaceholder>
        )}
        <RecipeCardBody>
          <RecipeName>{recipe.name}</RecipeName>
          <RecipeMetaRow>
            <MetaChip
              label={`${recipe.ingredients.length} ingredient${recipe.ingredients.length !== 1 ? 's' : ''}`}
              size="small"
              sx={{
                background: 'rgba(249, 115, 22, 0.1)',
                color: '#f97316',
              }}
            />
            {recipe.instructions && recipe.instructions.length > 0 && (
              <MetaChip
                label={`${recipe.instructions.length} step${recipe.instructions.length !== 1 ? 's' : ''}`}
                size="small"
                sx={{
                  background: 'rgba(244, 63, 94, 0.1)',
                  color: '#f43f5e',
                }}
              />
            )}
          </RecipeMetaRow>
        </RecipeCardBody>
      </RecipeCardTapArea>
    </RecipeCard>
  )
}

export default RecipeItem
