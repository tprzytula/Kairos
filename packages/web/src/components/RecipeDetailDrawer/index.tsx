import { useCallback } from 'react'
import { IconButton } from '@mui/material'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import CloseIcon from '@mui/icons-material/Close'
import { IRecipe } from '../../types/recipe'
import RecipeItem from '../RecipeItem'
import DraggableBottomDrawer from '../DraggableBottomDrawer'
import {
  DrawerHeader,
  DrawerHeaderLeft,
  DrawerIconBox,
  DrawerTitle,
  ContentContainer,
} from '../DrawerHeader/index.styled'

interface RecipeDetailDrawerProps {
  open: boolean
  onClose: () => void
  recipe: IRecipe | null
}

const RecipeDetailDrawer = ({ open, onClose, recipe }: RecipeDetailDrawerProps) => {
  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  return (
    <DraggableBottomDrawer
      open={open}
      onClose={handleClose}
      paperSx={{ height: 'calc(100% - env(safe-area-inset-top) - 16px)' }}
      contentSx={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      dragHandleContent={
        <DrawerHeader>
          <DrawerHeaderLeft>
            <DrawerIconBox>
              <RestaurantIcon />
            </DrawerIconBox>
            <DrawerTitle>{recipe?.name ?? 'Recipe'}</DrawerTitle>
          </DrawerHeaderLeft>
          <IconButton size="small" onClick={handleClose} aria-label="Close">
            <CloseIcon />
          </IconButton>
        </DrawerHeader>
      }
    >
      <ContentContainer>
        {recipe && (
          <RecipeItem
            recipe={recipe}
            onEdit={() => {}}
            onUseRecipe={() => {}}
          />
        )}
      </ContentContainer>
    </DraggableBottomDrawer>
  )
}

export default RecipeDetailDrawer
