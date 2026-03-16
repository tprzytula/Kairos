import { useCallback } from 'react'
import { Box, Button, Checkbox, Chip, Drawer, FormControlLabel, Typography } from '@mui/material'
import AssignmentIcon from '@mui/icons-material/Assignment'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import dayjs from 'dayjs'
import { ITodoItem } from '../../api/toDoList/retrieve/types'
import { useDragToClose } from '../../hooks/useDragToClose'
import {
  ContentContainer,
  DescriptionText,
  DrawerHeader,
  DrawerHeaderLeft,
  DrawerIconBox,
  DrawerTitle,
  Footer,
  ItemName,
  MetaRow,
  NoDescriptionText,
} from './index.styled'

interface ToDoItemPreviewDrawerProps {
  item: ITodoItem | null
  onClose: () => void
  onEdit: (id: string) => void
  onMarkDone?: (id: string) => void
  onStepToggle?: (todoId: string, stepId: string, isDone: boolean) => void
  onDelete?: (id: string) => void
}

const ToDoItemPreviewDrawer = ({ item, onClose, onEdit, onMarkDone, onStepToggle, onDelete }: ToDoItemPreviewDrawerProps) => {
  const { dragOffset, isDragging, onPointerDown, onPointerMove, onPointerUp } = useDragToClose({ onClose })

  const handleEdit = useCallback(() => {
    if (!item) return
    onEdit(item.id)
    onClose()
  }, [item, onEdit, onClose])

  const handleMarkDone = useCallback(() => {
    if (!item) return
    onMarkDone?.(item.id)
    onClose()
  }, [item, onMarkDone, onClose])

  const handleDelete = useCallback(() => {
    if (!item) return
    onDelete?.(item.id)
    onClose()
  }, [item, onDelete, onClose])

  const steps = item?.steps ?? []

  return (
    <Drawer
      anchor="bottom"
      open={item !== null}
      onClose={onClose}
      transitionDuration={{ enter: 350, exit: 300 }}
      PaperProps={{
        sx: {
          borderRadius: '16px 16px 0 0',
          overflow: 'hidden',
          background: 'transparent',
          maxHeight: '80vh',
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
        }}
      >
        {/* Drag handle */}
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
                <AssignmentIcon />
              </DrawerIconBox>
              <DrawerTitle>Task Preview</DrawerTitle>
            </DrawerHeaderLeft>
            <Chip
              label={item?.isDone ? 'Done' : 'Pending'}
              size="small"
              color={item?.isDone ? 'success' : 'default'}
              variant="outlined"
            />
          </DrawerHeader>
        </Box>

        <ContentContainer>
          <ItemName>{item?.name}</ItemName>

          {item?.dueDate && (
            <MetaRow>
              <CalendarTodayIcon sx={{ fontSize: '1rem' }} />
              {dayjs(item.dueDate).format('dddd, D MMMM YYYY')}
            </MetaRow>
          )}

          {item?.description ? (
            <DescriptionText>{item.description}</DescriptionText>
          ) : (
            <NoDescriptionText>No description</NoDescriptionText>
          )}

          {steps.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 1, color: 'text.secondary', letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.75rem' }}
              >
                Sub-steps
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {steps.map(step => (
                  <FormControlLabel
                    key={step.id}
                    control={
                      <Checkbox
                        checked={step.isDone}
                        onChange={() => onStepToggle?.(item!.id, step.id, !step.isDone)}
                        size="small"
                        sx={{
                          color: 'rgba(102, 126, 234, 0.5)',
                          '&.Mui-checked': { color: '#667eea' },
                        }}
                      />
                    }
                    label={
                      <Typography
                        variant="body2"
                        sx={{
                          textDecoration: step.isDone ? 'line-through' : 'none',
                          color: step.isDone ? 'text.disabled' : 'text.primary',
                        }}
                      >
                        {step.name}
                      </Typography>
                    }
                    sx={{
                      mx: 0,
                      borderRadius: '8px',
                      px: 1,
                      '&:hover': { background: 'rgba(102, 126, 234, 0.05)' },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </ContentContainer>

        <Footer>
          {!item?.isDone && onMarkDone && (
            <Button
              variant="contained"
              fullWidth
              startIcon={<CheckCircleIcon />}
              onClick={handleMarkDone}
              sx={{
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 600,
                py: 1.25,
                boxShadow: 'none',
                mb: 1,
                '&:hover': { boxShadow: 'none', opacity: 0.9 },
              }}
            >
              Mark as Complete
            </Button>
          )}
          <Button
            variant="contained"
            fullWidth
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              py: 1.25,
              boxShadow: 'none',
              '&:hover': { boxShadow: 'none', opacity: 0.9 },
            }}
          >
            Edit Task
          </Button>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            color="error"
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              py: 1.25,
              mt: 1,
            }}
          >
            Delete Task
          </Button>
        </Footer>
      </Box>
    </Drawer>
  )
}

export default ToDoItemPreviewDrawer
