import { useToDoListContext } from '../../providers/ToDoListProvider';
import ToDoItem from '../ToDoItem';
import ToDoItemPlaceholder from '../ToDoItemPlaceholder';
import { Container, EmptyListContainer, EmptyListMessage } from './index.styled';

const PlaceholderComponent = () => (
  <Container>
    {Array.from({ length: 20 }).map((_, index) => (
      <ToDoItemPlaceholder key={index} />
    ))}
  </Container>
)

const EmptyListComponent = () => (
  <EmptyListContainer>
    <EmptyListMessage>No items in your to do list</EmptyListMessage>
  </EmptyListContainer>
)

export const ToDoList = () => {
  const { toDoList, isLoading } = useToDoListContext();

  if (isLoading) {
    return <PlaceholderComponent />
  }

  if (toDoList.length === 0) {
    return <EmptyListComponent />
  }

  return (
    <Container>
      {toDoList.map(({ id, name, description, isDone, dueDate }) => (
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
