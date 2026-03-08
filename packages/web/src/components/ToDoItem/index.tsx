import { Container, ActionArea, Content, Name, Description, DueDate } from './index.styled'
import { ITodoItemProps } from './types'
import { useAppState } from '../../providers/AppStateProvider';
import { ActionName } from '../../providers/AppStateProvider/enums';
import { useMemo, useCallback, memo } from 'react';
import { Chip } from '@mui/material';

const ToDoItem = memo(({ id, name, description, dueDate, steps }: ITodoItemProps) => {
  const { state: { selectedTodoItems }, dispatch } = useAppState()
  const isSelected = useMemo(() => selectedTodoItems.has(id), [selectedTodoItems, id])

  const markAsSelected = useCallback(() => {
    dispatch({
      type: ActionName.SELECT_TODO_ITEM,
      payload: {
        id,
      },
    })
  }, [dispatch, id])

  const markAsUnselected = useCallback(() => {
    dispatch({
      type: ActionName.UNSELECT_TODO_ITEM,
      payload: {
        id,
      },
    })
  }, [dispatch, id])

  const handleClick = useCallback(() => {
    if (isSelected) {
      markAsUnselected()
    } else {
      markAsSelected()
    }
  }, [isSelected, markAsSelected, markAsUnselected])

  const formattedDueDate = useMemo(() => {
    if (dueDate) {
      const date = new Date(dueDate)
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
      const dateString = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
      return `${dayName}, ${dateString}`
    }
  }, [dueDate])

  const stepProgress = useMemo(() => {
    if (!steps || steps.length === 0) return null
    const done = steps.filter(s => s.isDone).length
    return `${done} / ${steps.length}`
  }, [steps])

  return (
    <Container isSelected={isSelected}>
      <ActionArea
        onClick={handleClick}
      >
        <Content>
          <Name>{name}</Name>
          { description?.trim() && <Description>{description}</Description> }
          <DueDate>{formattedDueDate}</DueDate>
          {stepProgress && (
            <Chip
              label={`${stepProgress} steps`}
              size="small"
              sx={{
                mt: 0.5,
                height: 20,
                fontSize: '0.7rem',
                fontWeight: 600,
                alignSelf: 'flex-start',
                background: 'rgba(102, 126, 234, 0.12)',
                color: '#667eea',
                border: 'none',
              }}
            />
          )}
        </Content>
      </ActionArea>
    </Container>
  )
});

ToDoItem.displayName = 'ToDoItem';

export default ToDoItem;
