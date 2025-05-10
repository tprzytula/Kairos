import { useMemo } from 'react';
import { useToDoListContext } from '../../providers/ToDoListProvider';
import ToDoItem from '../ToDoItem';
import ToDoItemPlaceholder from '../ToDoItemPlaceholder';
import { Container, EmptyListMessage } from './index.styled';

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
  const { toDoList, isLoading } = useToDoListContext();
  const visibleToDoItems = useMemo(() => toDoList.filter(({ isDone }) => !isDone), [toDoList]);

  if (isLoading) {
    return <PlaceholderComponent />
  }

  if (toDoList.length === 0) {
    return <EmptyListComponent />
  }

  return (
    <Container>
      {visibleToDoItems.map(({ id, name, description, isDone, dueDate }) => (
        <ToDoItem 
          key={id} 
          id={id}
          name={name} 
          description={description} 
          isDone={isDone} 
          dueDate={dueDate}
        />
      ))}
    </Container>
  );
};

export default ToDoList;
