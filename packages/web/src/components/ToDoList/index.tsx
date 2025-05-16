import { useCallback, useMemo } from 'react';
import { useToDoListContext } from '../../providers/ToDoListProvider';
import ToDoItem from '../ToDoItem';
import ToDoItemPlaceholder from '../ToDoItemPlaceholder';
import { Container, EmptyListMessage } from './index.styled';
import SwipeableList from '../SwipeableList';
import { TrailingActions } from 'react-swipeable-list';
import { DeleteAction } from '../GroceryList/index.styled';
import { useAppState } from '../../providers/AppStateProvider';
import { ActionName } from '../../providers/AppStateProvider/enums';
import { updateToDoItems } from '../../api/toDoList';
import { showAlert } from '../../utils/alert';

const PlaceholderComponent = () => (
  <Container>
    {Array.from({ length: 20 }).map((_, index) => (
      <ToDoItemPlaceholder key={index} />
    ))}
  </Container>
)

const EmptyListComponent = () => (
  <Container>
    <EmptyListMessage>No items in your to do list</EmptyListMessage>
  </Container>
)

export const ToDoList = () => {
  const { dispatch } = useAppState();
  const { toDoList, isLoading, removeFromToDoList } = useToDoListContext();
  const visibleToDoItems = useMemo(() => toDoList.filter(({ isDone }) => !isDone), [toDoList]);

  const clearSelectedTodoItems = useCallback((id: string) => {
    dispatch({ 
      type: ActionName.CLEAR_SELECTED_TODO_ITEMS, 
      payload: [ id ] 
    })
  }, [dispatch])

  const markToDoItemAsDone = useCallback(async (id: string) => {
    try {
      await updateToDoItems([{ id, isDone: true }]);
      clearSelectedTodoItems(id)
      removeFromToDoList(id)
    } catch (error) {
      console.error("Failed to mark to do items as done:", error);
      showAlert({
        description: "Failed to mark to do items as done",
        severity: "error",
      }, dispatch)
    }
  }, [dispatch]);

  const trailingActions = useCallback((id: string) => (
    <TrailingActions>
      <DeleteAction onClick={() => markToDoItemAsDone(id)}>
        Delete
      </DeleteAction>
    </TrailingActions>
  ), [dispatch])

  if (isLoading) {
    return <PlaceholderComponent />
  }

  if (toDoList.length === 0) {
    return <EmptyListComponent />
  }

  return (
    <Container>
      <SwipeableList
        component={ToDoItem}
        list={visibleToDoItems}
        trailingActions={trailingActions}
        fullSwipe={true}
      />
    </Container>
  );
};

export default ToDoList;
