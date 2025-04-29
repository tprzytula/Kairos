import {
  Container,
  Content,
  NamePlaceholder,
  DescriptionPlaceholder,
  DueDatePlaceholder,
  ActionArea,
  MediaPlaceholder,
} from './index.styled';

const ToDoItemPlaceholder = () => (
  <Container isPurchased={false} aria-label="To do item placeholder">
    <ActionArea>
      <MediaPlaceholder />
      <Content>
        <NamePlaceholder />
        <DescriptionPlaceholder />
        <DueDatePlaceholder />
      </Content>
    </ActionArea>
  </Container>
);

export default ToDoItemPlaceholder;
