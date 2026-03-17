import { Box, Drawer, SxProps, Theme } from '@mui/material'
import { useDragToClose } from '../../hooks/useDragToClose'

interface DraggableBottomDrawerProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  dragHandleContent?: React.ReactNode
  paperSx?: SxProps<Theme>
  contentSx?: SxProps<Theme>
}

const DraggableBottomDrawer = ({
  open,
  onClose,
  children,
  dragHandleContent,
  paperSx,
  contentSx,
}: DraggableBottomDrawerProps) => {
  const { dragOffset, isDragging, onPointerDown, onPointerMove, onPointerUp } = useDragToClose({ onClose })

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      transitionDuration={{ enter: 350, exit: 300 }}
      PaperProps={{
        sx: {
          borderRadius: '16px 16px 0 0',
          overflow: 'hidden',
          background: 'transparent',
          ...paperSx as object,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          bgcolor: 'background.paper',
          transform: `translateY(${dragOffset}px)`,
          transition: isDragging.current
            ? 'transform 0s'
            : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          ...contentSx as object,
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
          {dragHandleContent}
        </Box>
        {children}
      </Box>
    </Drawer>
  )
}

export default DraggableBottomDrawer
