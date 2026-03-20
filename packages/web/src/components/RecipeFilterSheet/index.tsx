import { Box, IconButton } from '@mui/material'
import TuneIcon from '@mui/icons-material/Tune'
import CloseIcon from '@mui/icons-material/Close'
import { MealType, MEAL_TYPE_ORDER } from '../../enums/mealType'
import FilterChip from '../FilterChip'
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
  onToggleMealType: (type: MealType) => void
  onClearAll: () => void
}

const RecipeFilterSheet = ({
  open,
  onClose,
  selectedMealTypes,
  onToggleMealType,
  onClearAll,
}: RecipeFilterSheetProps) => {
  const totalFilters = selectedMealTypes.length

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
              <FilterChip
                key={type}
                label={type}
                isSelected={selectedMealTypes.includes(type)}
                onClick={() => onToggleMealType(type)}
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
