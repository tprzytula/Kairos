import { useState, useCallback } from 'react'
import { IconButton } from '@mui/material'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import StandardLayout from '../../layout/standardLayout'
import ModernPageHeader from '../../components/ModernPageHeader'
import ActionButtonsBar from '../../components/ActionButtonsBar'
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

const RecipesContent = () => {
  const { recipes } = useRecipeContext()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState<IRecipe | null>(null)

  const handleAddClick = useCallback(() => {
    setEditingRecipe(null)
    setIsFormOpen(true)
  }, [])

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
        <ActionButtonsBar
          actionButton={{
            isEnabled: true,
            onClick: handleAddClick,
            children: 'Add Recipe',
            accentGradient: SECTION_GRADIENTS.recipe,
          }}
        />
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
