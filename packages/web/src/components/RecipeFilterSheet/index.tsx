import { Box, Chip, IconButton } from '@mui/material'
import TuneIcon from '@mui/icons-material/Tune'
import CloseIcon from '@mui/icons-material/Close'
import { MealType, MEAL_TYPE_ORDER } from '../../enums/mealType'
import { RecipeDishType, RecipeDishTypeLabelMap, RecipeDishTypeOrder } from '../../enums/recipeDishType'
import DraggableBottomDrawer from '../DraggableBottomDrawer'
import {
  DrawerHeader,
  DrawerHeaderLeft,
  DrawerIconBox,
  DrawerTitle,
} from '../DrawerHeader/index.styled'
import {
  FilterSheetContent,
  FilterSectionTitle,
  FilterChipGrid,
  ClearButton,
} from './index.styled'

interface RecipeFilterSheetProps {
  open: boolean
  onClose: () => void
  selectedMealTypes: MealType[]
  selectedDishTypes: RecipeDishType[]
  onToggleMealType: (type: MealType) => void
  onToggleDishType: (type: RecipeDishType) => void
  onClearAll: () => void
}

const filterChipSx = (isSelected: boolean) => ({
  borderRadius: '8px',
  ...(isSelected
    ? { background: 'rgba(249,115,22,0.15)', color: '#ea580c', borderColor: 'rgba(249,115,22,0.3)', fontWeight: 600 }
    : { borderColor: 'rgba(0,0,0,0.12)', color: 'text.secondary' }),
})

const RecipeFilterSheet = ({
  open,
  onClose,
  selectedMealTypes,
  selectedDishTypes,
  onToggleMealType,
  onToggleDishType,
  onClearAll,
}: RecipeFilterSheetProps) => {
  const totalFilters = selectedMealTypes.length + selectedDishTypes.length

  return (
    <DraggableBottomDrawer
      open={open}
      onClose={onClose}
      dragHandleContent={
        <DrawerHeader>
          <DrawerHeaderLeft>
            <DrawerIconBox>
              <TuneIcon />
            </DrawerIconBox>
            <DrawerTitle>Filters</DrawerTitle>
          </DrawerHeaderLeft>
          <IconButton size="small" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </IconButton>
        </DrawerHeader>
      }
    >
      <FilterSheetContent>
        <Box>
          <FilterSectionTitle>Meal Type</FilterSectionTitle>
          <FilterChipGrid>
            {MEAL_TYPE_ORDER.filter((t) => t !== MealType.Other).map((type) => (
              <Chip
                key={type}
                label={type}
                size="small"
                variant={selectedMealTypes.includes(type) ? 'filled' : 'outlined'}
                onClick={() => onToggleMealType(type)}
                sx={filterChipSx(selectedMealTypes.includes(type))}
              />
            ))}
          </FilterChipGrid>
        </Box>

        <Box>
          <FilterSectionTitle>Dish Type</FilterSectionTitle>
          <FilterChipGrid>
            {RecipeDishTypeOrder.map((type) => (
              <Chip
                key={type}
                label={RecipeDishTypeLabelMap[type]}
                size="small"
                variant={selectedDishTypes.includes(type) ? 'filled' : 'outlined'}
                onClick={() => onToggleDishType(type)}
                sx={filterChipSx(selectedDishTypes.includes(type))}
              />
            ))}
          </FilterChipGrid>
        </Box>

        {totalFilters > 0 && (
          <ClearButton variant="outlined" size="small" onClick={onClearAll}>
            Clear All ({totalFilters})
          </ClearButton>
        )}
      </FilterSheetContent>
    </DraggableBottomDrawer>
  )
}

export default RecipeFilterSheet
