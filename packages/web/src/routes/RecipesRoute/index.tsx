import { useState, useCallback, useEffect } from 'react'
import { IconButton } from '@mui/material'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SearchIconMui from '@mui/icons-material/Search'
import TuneIcon from '@mui/icons-material/Tune'
import StandardLayout from '../../layout/standardLayout'
import ModernPageHeader from '../../components/ModernPageHeader'
import RecipeList from '../../components/RecipeList'
import RecipeForm from '../../components/RecipeForm'
import RecipeViewDrawer from '../../components/RecipeViewDrawer'
import RecipeFilterSheet from '../../components/RecipeFilterSheet'
import FilterChip from '../../components/FilterChip'
import DraggableBottomDrawer from '../../components/DraggableBottomDrawer'
import { useRecipeContext, RecipeProvider } from '../../providers/RecipeProvider'
import { IRecipe } from '../../types/recipe'
import { MealType } from '../../enums/mealType'
import { RecipeDishType, RecipeDishTypeLabelMap, RecipeDishTypeOrder } from '../../enums/recipeDishType'
import { useItemDefaults } from '../../hooks/useItemDefaults'
import { retrieveGroceryListDefaults } from '../../api/groceryList'
import { SECTION_GRADIENTS, SECTION_ACCENT_RGB } from '../../constants/sectionColors'
import {
  SearchContainer,
  SearchIcon,
  SearchInput,
  ChipRow,
  FilterChipsContainer,
  FilterButton,
  FilterBadge,
} from '../../components/RecipeList/index.styled'
import {
  DrawerHeader,
  DrawerHeaderLeft,
  DrawerIconBox,
  DrawerTitle,
  ContentContainer,
} from '../../components/DrawerHeader/index.styled'
import { Container } from './index.styled'
import { ScrollableContainer } from '../../components/ScrollableContainer'
import { useSearchParams, useNavigate } from 'react-router'

const RecipesContent = () => {
  const { removeRecipe, fetchRecipes } = useRecipeContext()
  const { defaults } = useItemDefaults({ fetchMethod: retrieveGroceryListDefaults })
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState<IRecipe | null>(null)
  const [viewingRecipe, setViewingRecipe] = useState<IRecipe | null>(null)
  const [search, setSearch] = useState('')
  const [selectedMealTypes, setSelectedMealTypes] = useState<MealType[]>([])
  const [selectedDishTypes, setSelectedDishTypes] = useState<RecipeDishType[]>([])
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      setEditingRecipe(null)
      setIsFormOpen(true)
      navigate('/recipes', { replace: true })
    }
  }, [searchParams, navigate])

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

  const handleViewRecipe = useCallback((recipe: IRecipe) => {
    setViewingRecipe(recipe)
  }, [])

  const handleCloseView = useCallback(() => {
    setViewingRecipe(null)
  }, [])

  const handleViewToEdit = useCallback((recipe: IRecipe) => {
    setViewingRecipe(null)
    setEditingRecipe(recipe)
    setIsFormOpen(true)
  }, [])

  const _handleDeleteFromView = useCallback(async (recipe: IRecipe) => {
    setViewingRecipe(null)
    await removeRecipe(recipe.id)
  }, [removeRecipe])

  const handleFormDone = useCallback(() => {
    setEditingRecipe(null)
    setIsFormOpen(false)
  }, [])

  const handleDrawerClose = useCallback(() => {
    setEditingRecipe(null)
    setIsFormOpen(false)
  }, [])

  const mealTypeFilterCount = selectedMealTypes.length

  return (
    <StandardLayout>
      <ModernPageHeader
        title="Recipes"
        icon={<MenuBookIcon />}
        accentGradient={SECTION_GRADIENTS.recipe}
        accentRgb={SECTION_ACCENT_RGB.recipe}
      >
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
        <ChipRow>
          <FilterButton onClick={() => setIsFilterSheetOpen(true)} aria-label="More filters">
            <TuneIcon />
            {mealTypeFilterCount > 0 && <FilterBadge>{mealTypeFilterCount}</FilterBadge>}
          </FilterButton>
          <FilterChipsContainer>
            {RecipeDishTypeOrder.map((type) => (
              <FilterChip
                key={type}
                label={RecipeDishTypeLabelMap[type]}
                isSelected={selectedDishTypes.includes(type)}
                onClick={() => toggleDishType(type)}
              />
            ))}
          </FilterChipsContainer>
        </ChipRow>
      </ModernPageHeader>
      <Container>
        <ScrollableContainer onRefresh={fetchRecipes}>
          <RecipeList
            search={search}
            onViewRecipe={handleViewRecipe}
            selectedMealTypes={selectedMealTypes}
            selectedDishTypes={selectedDishTypes}
          />
        </ScrollableContainer>
      </Container>
      <RecipeViewDrawer
        recipe={viewingRecipe}
        onClose={handleCloseView}
        onEdit={handleViewToEdit}
        defaults={defaults}
      />
      <RecipeFilterSheet
        open={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        selectedMealTypes={selectedMealTypes}
        onToggleMealType={toggleMealType}
        onClearAll={clearAllFilters}
      />
      <DraggableBottomDrawer
        open={isFormOpen}
        onClose={handleDrawerClose}
        paperSx={{ height: 'calc(100% - env(safe-area-inset-top) - 16px)' }}
        contentSx={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        dragHandleContent={
          <DrawerHeader>
            <DrawerHeaderLeft>
              <IconButton size="small" onClick={handleDrawerClose} aria-label="Back to recipes">
                <ArrowBackIcon />
              </IconButton>
              <DrawerIconBox>
                <MenuBookIcon />
              </DrawerIconBox>
              <DrawerTitle>{editingRecipe ? 'Edit Recipe' : 'New Recipe'}</DrawerTitle>
            </DrawerHeaderLeft>
          </DrawerHeader>
        }
      >
        <ContentContainer>
          <RecipeForm
            initialRecipe={editingRecipe}
            onDone={handleFormDone}
          />
        </ContentContainer>
      </DraggableBottomDrawer>
    </StandardLayout>
  )
}

export const RecipesRoute = () => {
  return (
    <RecipeProvider>
      <RecipesContent />
    </RecipeProvider>
  )
}

export default RecipesRoute
