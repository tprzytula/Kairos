import { Container, ActionArea, Content, Name, Description, DueDate } from './index.styled'
import { ITodoItemProps } from './types'
import { useAppState } from '../../providers/AppStateProvider';
import { ActionName } from '../../providers/AppStateProvider/enums';
import { useMemo, useCallback, memo } from 'react';

const ToDoItem = memo(({ id, name, description, dueDate }: ITodoItemProps) => {
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

  return (
    <Container isSelected={isSelected}>
      <ActionArea
        onClick={handleClick}
      >  
        <Content>
          <Name>{name}</Name>
          { description?.trim() && <Description>{description}</Description> }
          <DueDate>{formattedDueDate}</DueDate>
        </Content>
      </ActionArea>
    </Container>
  )
});

ToDoItem.displayName = 'ToDoItem';

export default ToDoItem;
