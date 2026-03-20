import { useState, useCallback } from 'react'
import { IconButton } from '@mui/material'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { IRecipe } from '../../types/recipe'
import { useItemDefaults } from '../../hooks/useItemDefaults'
import { retrieveGroceryListDefaults } from '../../api/groceryList'
import RecipeList from '../RecipeList'
import RecipeForm from '../RecipeForm'
import DraggableBottomDrawer from '../DraggableBottomDrawer'
import {
  DrawerHeader,
  DrawerHeaderLeft,
  DrawerIconBox,
  DrawerTitle,
  ContentContainer,
} from '../DrawerHeader/index.styled'

interface RecipeDrawerProps {
  open: boolean
  onClose: () => void
  onUseRecipe?: () => void
  shopId?: string
}

const RecipeDrawer = ({ open, onClose, onUseRecipe, shopId }: RecipeDrawerProps) => {
  const [view, setView] = useState<'list' | 'form'>('list')
  const [editingRecipe, setEditingRecipe] = useState<IRecipe | null>(null)
  const { defaults } = useItemDefaults({ fetchMethod: retrieveGroceryListDefaults })

  const handleAddClick = useCallback(() => {
    setEditingRecipe(null)
    setView('form')
  }, [])

  const handleEditRecipe = useCallback((recipe: IRecipe) => {
    setEditingRecipe(recipe)
    setView('form')
  }, [])

  const handleFormDone = useCallback(() => {
    setEditingRecipe(null)
    setView('list')
  }, [])

  const handleClose = useCallback(() => {
    setView('list')
    setEditingRecipe(null)
    onClose()
  }, [onClose])

  const handleUseRecipe = useCallback(() => {
    handleClose()
    onUseRecipe?.()
  }, [handleClose, onUseRecipe])

  return (
    <DraggableBottomDrawer
      open={open}
      onClose={handleClose}
      paperSx={{ height: 'calc(100% - env(safe-area-inset-top) - 16px)' }}
      contentSx={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      dragHandleContent={
        <DrawerHeader>
          <DrawerHeaderLeft>
            {view === 'form' && (
              <IconButton size="small" onClick={handleFormDone} aria-label="Back to recipes">
                <ArrowBackIcon />
              </IconButton>
            )}
            <DrawerIconBox>
              <MenuBookIcon />
            </DrawerIconBox>
            <DrawerTitle>{view === 'form' ? (editingRecipe ? 'Edit Recipe' : 'New Recipe') : 'Recipes'}</DrawerTitle>
          </DrawerHeaderLeft>
          {view === 'list' && (
            <IconButton onClick={handleAddClick} aria-label="Add recipe" size="small">
              <AddIcon />
            </IconButton>
          )}
        </DrawerHeader>
      }
    >
      <ContentContainer>
        {view === 'list' ? (
          <RecipeList
            onEditRecipe={handleEditRecipe}
            onUseRecipe={handleUseRecipe}
            shopId={shopId}
            defaults={defaults}
          />
        ) : (
          <RecipeForm
            initialRecipe={editingRecipe}
            onDone={handleFormDone}
          />
        )}
      </ContentContainer>
    </DraggableBottomDrawer>
  )
}

export default RecipeDrawer
