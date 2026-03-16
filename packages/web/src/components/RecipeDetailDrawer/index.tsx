import { useCallback, useRef, useState } from 'react'
import { Box, Drawer, IconButton } from '@mui/material'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import CloseIcon from '@mui/icons-material/Close'
import { IRecipe } from '../../types/recipe'
import RecipeItem from '../RecipeItem'
import {
  DrawerHeader,
  DrawerHeaderLeft,
  DrawerIconBox,
  DrawerTitle,
  ContentContainer,
} from '../RecipeDrawer/index.styled'

const DRAG_CLOSE_THRESHOLD = 100

interface RecipeDetailDrawerProps {
  open: boolean
  onClose: () => void
  recipe: IRecipe | null
}

const RecipeDetailDrawer = ({ open, onClose, recipe }: RecipeDetailDrawerProps) => {
  const [dragOffset, setDragOffset] = useState(0)
  const isDragging = useRef(false)
  const dragStartY = useRef(0)

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

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
              <DrawerIconBox>
                <RestaurantIcon />
              </DrawerIconBox>
              <DrawerTitle>{recipe?.name ?? 'Recipe'}</DrawerTitle>
            </DrawerHeaderLeft>
            <IconButton size="small" onClick={handleClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
          </DrawerHeader>
        </Box>

        <ContentContainer>
          {recipe && (
            <RecipeItem
              recipe={recipe}
              onEdit={() => {}}
              onUseRecipe={() => {}}
            />
          )}
        </ContentContainer>
      </Box>
    </Drawer>
  )
}

export default RecipeDetailDrawer
