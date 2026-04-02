import { useCallback, useMemo, useRef, useState } from 'react'
import { Box, Checkbox, Chip, FormControlLabel, Typography } from '@mui/material'
import AssignmentIcon from '@mui/icons-material/Assignment'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import dayjs from 'dayjs'
import { ITodoItem } from '../../api/toDoList/retrieve/types'
import { usePreviewDrawerActions } from '../../hooks/usePreviewDrawerActions'
import { useStepCompletionRewards } from '../../hooks/useStepCompletionRewards'
import { StepRewardState } from '../../hooks/useStepCompletionRewards/types'
import BasePreviewDrawer from '../BasePreviewDrawer'
import DrawerActionButton from '../DrawerActionButton'
import PrivateItemBadge from '../PrivateItemBadge'
import ConfettiBurst from '../ConfettiBurst'
import CompleteTaskBanner from '../CompleteTaskBanner'
import {
  ContentContainer,
  DescriptionText,
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

const ToDoItemPreviewDrawer = ({ item, onClose, onEdit, onMarkDone, onStepToggle, onDelete }: ToDoItemPreviewDrawerProps): React.ReactElement => {
  const onEditItem = useMemo(() => (todoItem: ITodoItem) => onEdit(todoItem.id), [onEdit])
  const [rewardState, setRewardState] = useState<StepRewardState | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const { processStepToggle } = useStepCompletionRewards()

  const { handleEdit, handleDelete } = usePreviewDrawerActions({
    item,
    onEdit: onEditItem,
    onDelete,
    onClose,
  })

  const handleMarkDone = useCallback(() => {
    if (!item) return
    onMarkDone?.(item.id)
    onClose()
  }, [item, onMarkDone, onClose])

  const steps = item?.steps ?? []
  const doneCount = steps.filter(s => s.isDone).length
  const totalSteps = steps.length
  const percent = totalSteps > 0 ? Math.round((doneCount / totalSteps) * 100) : 0
  const isAllComplete = totalSteps > 0 && doneCount === totalSteps

  // Sort steps: unchecked first, checked second
  const displaySteps = useMemo(() => {
    const unchecked = steps.filter(s => !s.isDone)
    const checked = steps.filter(s => s.isDone)
    return [...unchecked, ...checked]
  }, [steps])

  const handleStepChange = useCallback((stepId: string, currentIsDone: boolean) => {
    if (!item) return
    const newIsDone = !currentIsDone
    const updatedSteps = steps.map(s => (s.id === stepId ? { ...s, isDone: newIsDone } : s))

    const state = processStepToggle({
      previousSteps: steps,
      updatedSteps,
      toggledStepId: stepId,
      newIsDone,
    })
    setRewardState(state)

    onStepToggle?.(item.id, stepId, newIsDone)
  }, [item, steps, onStepToggle, processStepToggle])

  return (
    <BasePreviewDrawer
      open={item !== null}
      onClose={onClose}
      icon={<AssignmentIcon />}
      title="Task Preview"
      gradient={TODO_GRADIENT}
      headerRight={
        <Chip
          label={item?.isDone ? 'Done' : 'Pending'}
          size="small"
          color={item?.isDone ? 'success' : 'default'}
          variant="outlined"
        />
      }
      paperSx={{ maxHeight: '80vh' }}
    >
      <ContentContainer ref={contentRef}>
        <ItemName>
          {item?.name}
          {item?.visibility === 'private' && <PrivateItemBadge />}
        </ItemName>

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

        {totalSteps > 0 && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, color: 'text.secondary', letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.75rem' }}
              >
                Sub-steps
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.72rem',
                  color: isAllComplete ? '#059669' : 'text.secondary',
                }}
              >
                {percent}% · {doneCount}/{totalSteps}
              </Typography>
            </Box>

            {/* Progress bar */}
            <Box sx={{
              width: '100%',
              height: '4px',
              borderRadius: '2px',
              background: 'rgba(99, 102, 241, 0.08)',
              overflow: 'hidden',
              mb: 1.5,
            }}>
              <Box sx={{
                height: '100%',
                borderRadius: '2px',
                background: isAllComplete
                  ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                  : 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
                width: `${percent}%`,
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease',
              }} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {displaySteps.map(step => (
                <FormControlLabel
                  key={step.id}
                  control={
                    <Checkbox
                      checked={step.isDone}
                      onChange={() => handleStepChange(step.id, step.isDone)}
                      size="small"
                      sx={{
                        color: 'rgba(102, 126, 234, 0.5)',
                        '&.Mui-checked': {
                          color: '#667eea',
                          animation: 'none',
                        },
                        transition: 'transform 0.2s ease',
                      }}
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      sx={{
                        color: step.isDone ? 'text.disabled' : 'text.primary',
                        textDecoration: 'none',
                        backgroundImage: 'linear-gradient(currentColor, currentColor)',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: '0 50%',
                        backgroundSize: step.isDone ? '100% 1.5px' : '0% 1.5px',
                        transition: 'background-size 0.3s ease 0.1s, color 0.2s ease',
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
        {isAllComplete && onMarkDone && !item?.isDone && (
          <Box sx={{ mb: 1 }}>
            <CompleteTaskBanner onClick={handleMarkDone} />
          </Box>
        )}
        {!isAllComplete && !item?.isDone && onMarkDone && (
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

      <ConfettiBurst
        trigger={rewardState?.shouldConfetti ?? false}
        anchorRef={contentRef}
      />
    </BasePreviewDrawer>
  )
}

export default ToDoItemPreviewDrawer
