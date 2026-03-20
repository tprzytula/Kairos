import { useCallback } from 'react'
import { Box, Checkbox, Chip, FormControlLabel, Typography } from '@mui/material'
import AssignmentIcon from '@mui/icons-material/Assignment'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import dayjs from 'dayjs'
import { ITodoItem } from '../../api/toDoList/retrieve/types'
import DraggableBottomDrawer from '../DraggableBottomDrawer'
import DrawerActionButton from '../DrawerActionButton'
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
  TODO_GRADIENT,
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
    <DraggableBottomDrawer
      open={item !== null}
      onClose={onClose}
      paperSx={{ maxHeight: '80vh' }}
      dragHandleContent={
        <DrawerHeader>
          <DrawerHeaderLeft>
            <DrawerIconBox gradient={TODO_GRADIENT}>
              <AssignmentIcon />
            </DrawerIconBox>
            <DrawerTitle gradient={TODO_GRADIENT}>Task Preview</DrawerTitle>
          </DrawerHeaderLeft>
          <Chip
            label={item?.isDone ? 'Done' : 'Pending'}
            size="small"
            color={item?.isDone ? 'success' : 'default'}
            variant="outlined"
          />
        </DrawerHeader>
      }
    >
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
          <DrawerActionButton
            gradient="linear-gradient(135deg, #059669 0%, #047857 100%)"
            icon={<CheckCircleIcon />}
            label="Mark as Complete"
            onClick={handleMarkDone}
            sx={{ mb: 1 }}
          />
        )}
        <DrawerActionButton
          gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          icon={<EditIcon />}
          label="Edit Task"
          onClick={handleEdit}
        />
        <DrawerActionButton
          variant="outlined"
          icon={<DeleteIcon />}
          label="Delete Task"
          onClick={handleDelete}
          color="error"
          sx={{ mt: 1 }}
        />
      </Footer>
    </DraggableBottomDrawer>
  )
}

export default ToDoItemPreviewDrawer
