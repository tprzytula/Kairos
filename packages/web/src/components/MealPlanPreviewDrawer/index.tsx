import { Box, IconButton, Typography } from '@mui/material'
import DrawerActionButton from '../DrawerActionButton'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import DeleteIcon from '@mui/icons-material/Delete'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LocalDiningIcon from '@mui/icons-material/LocalDining'
import CloseIcon from '@mui/icons-material/Close'
import { IMealPlan } from '../../types/mealPlan'
import { useRecipeContext } from '../../providers/RecipeProvider'
import { usePreviewDrawerActions } from '../../hooks/usePreviewDrawerActions'
import DraggableBottomDrawer from '../DraggableBottomDrawer'
import { SECTION_GRADIENTS } from '../../constants/sectionColors'
import {
  DrawerHeader,
  DrawerHeaderLeft,
  DrawerIconBox,
  DrawerTitle,
  ContentContainer,
} from '../DrawerHeader/index.styled'
import {
  HeroImage,
  HeroPlaceholder,
  MealName,
  SectionHeader,
  SectionLabel,
  DetailRow,
  Footer,
} from './index.styled'

const MEAL_GRADIENT = SECTION_GRADIENTS.recipe

const formatDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

interface MealPlanPreviewDrawerProps {
  item: IMealPlan | null
  onClose: () => void
  onDelete: (id: string) => void
}

const MealPlanPreviewDrawer = ({ item, onClose, onDelete }: MealPlanPreviewDrawerProps) => {
  const { recipes } = useRecipeContext()
  const { handleDelete } = usePreviewDrawerActions({
    item,
    onDelete,
    onClose,
  })

  const recipeImage = item?.recipeId ? recipes.find(r => r.id === item.recipeId)?.imagePath : undefined
  const heroImage = item?.imagePath ?? recipeImage
  const placeholderSeed = item?.recipeName.charCodeAt(0) ?? 0

  return (
    <DraggableBottomDrawer
      open={item !== null}
      onClose={onClose}
      paperSx={{ height: 'calc(100% - env(safe-area-inset-top) - 16px)' }}
      dragHandleContent={
        <DrawerHeader>
          <DrawerHeaderLeft>
            <DrawerIconBox gradient={MEAL_GRADIENT}>
              <RestaurantIcon />
            </DrawerIconBox>
            <DrawerTitle gradient={MEAL_GRADIENT}>Meal</DrawerTitle>
          </DrawerHeaderLeft>
          <IconButton size="small" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </IconButton>
        </DrawerHeader>
      }
    >
      <ContentContainer>
        {heroImage ? (
          <HeroImage src={heroImage} alt={item?.recipeName ?? ''} />
        ) : item ? (
          <HeroPlaceholder seed={placeholderSeed}>
            <Typography
              sx={{
                fontSize: '3rem',
                fontWeight: 700,
                color: 'rgba(255, 255, 255, 0.85)',
                lineHeight: 1,
                userSelect: 'none',
              }}
            >
              {item.recipeName.charAt(0).toUpperCase()}
            </Typography>
          </HeroPlaceholder>
        ) : null}

        {item && <MealName>{item.recipeName}</MealName>}

        <Box>
          <SectionHeader>
            <SectionLabel>Details</SectionLabel>
          </SectionHeader>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', mt: 0.75 }}>
            <DetailRow>
              <CalendarTodayIcon />
              {item && formatDate(item.date)}
            </DetailRow>

            {item?.mealType && (
              <DetailRow>
                <LocalDiningIcon />
                {item.mealType}
              </DetailRow>
            )}
          </Box>
        </Box>
      </ContentContainer>

      <Footer>
        <DrawerActionButton
          variant="outlined"
          icon={<DeleteIcon />}
          label="Delete from Planner"
          onClick={handleDelete}
          color="error"
        />
      </Footer>
    </DraggableBottomDrawer>
  )
}

export default MealPlanPreviewDrawer
