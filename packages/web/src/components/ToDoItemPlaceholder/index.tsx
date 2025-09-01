import {
  Container,
  Content,
  NamePlaceholder,
  DescriptionPlaceholder,
  DescriptionLine,
  DescriptionLineShort,
  DueDatePlaceholder,
  ActionArea,
} from './index.styled';

const ToDoItemPlaceholder = () => (
  <Container isSelected={false} aria-label="To do item placeholder">
    <ActionArea>
      <Content>
        <NamePlaceholder />
        <DescriptionPlaceholder>
          <DescriptionLine />
          <DescriptionLineShort />
        </DescriptionPlaceholder>
        <DueDatePlaceholder />
      </Content>
    </ActionArea>
  </Container>
);

export default ToDoItemPlaceholder;
