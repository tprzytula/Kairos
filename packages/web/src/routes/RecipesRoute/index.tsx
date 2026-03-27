import { useState, useCallback, useEffect } from 'react'
import { IconButton } from '@mui/material'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SearchIconMui from '@mui/icons-material/Search'
import StandardLayout from '../../layout/standardLayout'
import ModernPageHeader from '../../components/ModernPageHeader'
import RecipeList from '../../components/RecipeList'
import RecipeForm from '../../components/RecipeForm'
import RecipeViewDrawer from '../../components/RecipeViewDrawer'
import DraggableBottomDrawer from '../../components/DraggableBottomDrawer'
import { useRecipeContext } from '../../providers/RecipeProvider'
import { IRecipe } from '../../types/recipe'
import { useItemDefaults } from '../../hooks/useItemDefaults'
import { retrieveGroceryListDefaults } from '../../api/groceryList'
import { SECTION_GRADIENTS, SECTION_ACCENT_RGB } from '../../constants/sectionColors'
import { SearchContainer, SearchIcon, SearchInput } from '../../components/RecipeList/index.styled'
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
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      setEditingRecipe(null)
      setIsFormOpen(true)
      navigate('/recipes', { replace: true })
    }
  }, [searchParams, navigate])

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
      </ModernPageHeader>
      <Container>
        <ScrollableContainer onRefresh={fetchRecipes}>
          <RecipeList
            search={search}
            onViewRecipe={handleViewRecipe}
          />
        </ScrollableContainer>
      </Container>
      <RecipeViewDrawer
        recipe={viewingRecipe}
        onClose={handleCloseView}
        onEdit={handleViewToEdit}
        defaults={defaults}
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
  return <RecipesContent />
}

export default RecipesRoute
