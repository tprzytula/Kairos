import { Typography } from '@mui/material'
import { COLORS } from '../../constants/colors'
import { IRecipe } from '../../types/recipe'
import { RecipeDishTypeLabelMap } from '../../enums/recipeDishType'
import {
  RecipeCard,
  RecipeCardTapArea,
  RecipeCardBody,
  RecipeThumbnail,
  RecipePlaceholder,
  RecipeName,
  RecipeMetaRow,
  MetaChip,
  DishTypeMetaChip,
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
            {recipe.dishTypes && recipe.dishTypes.length > 0 ? (
              <DishTypeMetaChip
                label={RecipeDishTypeLabelMap[recipe.dishTypes[0]]}
                size="small"
              />
            ) : (
              <MetaChip
                label={`${recipe.ingredients.length} ingredient${recipe.ingredients.length !== 1 ? 's' : ''}`}
                size="small"
                sx={{
                  background: COLORS.orange.bg,
                  color: COLORS.orange.primary,
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
