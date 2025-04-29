import { Container, ActionArea, Content, Name, Description, DueDate } from './index.styled'
import { ITodoItemProps } from './types'
import { useAppState } from '../../providers/AppStateProvider';
import { ActionName } from '../../providers/AppStateProvider/enums';
import { useMemo, useCallback } from 'react';

const ToDoItem = ({ id, name, description, dueDate }: ITodoItemProps) => {
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
      return new Date(dueDate).toLocaleDateString()
    }
  }, [dueDate])

  return (
    <Container isSelected={isSelected}>
      <ActionArea
        onClick={handleClick}
      >  
        <Content>
          <Name>{name}</Name>
          <Description>{description}</Description>
          <DueDate>{formattedDueDate}</DueDate>
        </Content>
      </ActionArea>
    </Container>
  )
};

export default ToDoItem;
