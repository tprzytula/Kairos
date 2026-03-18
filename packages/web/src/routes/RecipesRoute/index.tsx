import { useState, useCallback, useEffect } from 'react'
import { IconButton } from '@mui/material'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import StandardLayout from '../../layout/standardLayout'
import ModernPageHeader from '../../components/ModernPageHeader'
import RecipeList from '../../components/RecipeList'
import RecipeForm from '../../components/RecipeForm'
import DraggableBottomDrawer from '../../components/DraggableBottomDrawer'
import { useRecipeContext } from '../../providers/RecipeProvider'
import { IRecipe } from '../../types/recipe'
import { SECTION_GRADIENTS, SECTION_ACCENT_RGB } from '../../constants/sectionColors'
import {
  DrawerHeader,
  DrawerHeaderLeft,
  DrawerIconBox,
  DrawerTitle,
  ContentContainer,
} from '../../components/RecipeDrawer/index.styled'
import { Container, ScrollableContainer } from './index.styled'
import { useSearchParams, useNavigate } from 'react-router'

const RecipesContent = () => {
  const { recipes } = useRecipeContext()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState<IRecipe | null>(null)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      setEditingRecipe(null)
      setIsFormOpen(true)
      navigate('/recipes', { replace: true })
    }
  }, [searchParams, navigate])

  const handleEditRecipe = useCallback((recipe: IRecipe) => {
    setEditingRecipe(recipe)
    setIsFormOpen(true)
  }, [])

  const handleFormDone = useCallback(() => {
    setEditingRecipe(null)
    setIsFormOpen(false)
  }, [])

  const handleDrawerClose = useCallback(() => {
    setEditingRecipe(null)
    setIsFormOpen(false)
  }, [])

  const stats = [
    { value: recipes.length, label: 'Total' },
  ]

  return (
    <StandardLayout>
      <ModernPageHeader
        title="Recipes"
        icon={<MenuBookIcon />}
        accentGradient={SECTION_GRADIENTS.recipe}
        accentRgb={SECTION_ACCENT_RGB.recipe}
        stats={stats}
      />
      <Container>
        <ScrollableContainer>
          <RecipeList
            onEditRecipe={handleEditRecipe}
            onUseRecipe={handleDrawerClose}
          />
        </ScrollableContainer>
      </Container>
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
