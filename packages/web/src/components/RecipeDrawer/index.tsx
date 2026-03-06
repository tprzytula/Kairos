import { useState, useCallback, useRef } from 'react'
import { Box, Drawer, IconButton } from '@mui/material'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { IRecipe, IRecipeIngredient } from '../../types/recipe'
import RecipeList from '../RecipeList'
import RecipeForm from '../RecipeForm'
import {
  DrawerHeader,
  DrawerHeaderLeft,
  DrawerIconBox,
  DrawerTitle,
  ContentContainer,
} from './index.styled'

const DRAG_CLOSE_THRESHOLD = 100

interface RecipeDrawerProps {
  open: boolean
  onClose: () => void
  onUseRecipe?: () => void
  shopId?: string
}

const RecipeDrawer = ({ open, onClose, onUseRecipe, shopId }: RecipeDrawerProps) => {
  const [view, setView] = useState<'list' | 'form'>('list')
  const [editingRecipe, setEditingRecipe] = useState<IRecipe | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const isDragging = useRef(false)
  const dragStartY = useRef(0)

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

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true
    dragStartY.current = e.clientY
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return
    const offset = Math.max(0, e.clientY - dragStartY.current)
    setDragOffset(offset)
  }, [])

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging.current) {
      const finalOffset = Math.max(0, e.clientY - dragStartY.current)
      if (finalOffset >= DRAG_CLOSE_THRESHOLD) {
        handleClose()
      }
    }
    isDragging.current = false
    setDragOffset(0)
  }, [handleClose])

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={handleClose}
      transitionDuration={{ enter: 350, exit: 300 }}
      PaperProps={{
        sx: {
          height: 'calc(100% - env(safe-area-inset-top) - 16px)',
          borderRadius: '16px 16px 0 0',
          overflow: 'hidden',
          background: 'transparent',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          paddingBottom: 'env(safe-area-inset-bottom)',
          bgcolor: 'background.paper',
          transform: `translateY(${dragOffset}px)`,
          transition: isDragging.current
            ? 'transform 0s'
            : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Box
          role="button"
          aria-label="Drag to close"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          sx={{
            width: '100%',
            flexShrink: 0,
            cursor: 'grab',
            touchAction: 'none',
            userSelect: 'none',
            '& *': { touchAction: 'none', userSelect: 'none' },
            '&:active': { cursor: 'grabbing' },
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              pt: '10px',
              pb: '2px',
            }}
          >
            <Box
              sx={{
                width: '36px',
                height: '4px',
                borderRadius: '2px',
                background: 'rgba(0,0,0,0.15)',
              }}
            />
          </Box>
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
        </Box>

        <ContentContainer>
          {view === 'list' ? (
            <RecipeList
              onEditRecipe={handleEditRecipe}
              onUseRecipe={handleUseRecipe}
              shopId={shopId}
            />
          ) : (
            <RecipeForm
              initialRecipe={editingRecipe}
              onDone={handleFormDone}
            />
          )}
        </ContentContainer>
      </Box>
    </Drawer>
  )
}

export default RecipeDrawer
