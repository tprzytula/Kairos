import {
  Container,
  Content,
  NamePlaceholder,
  QuantityDisplayPlaceholder,
  QuantityPlaceholder,
  UnitPlaceholder,
  ActionArea,
  ActionContainer,
  MediaPlaceholder,
  ButtonPlaceholder,
} from './index.styled';

const GroceryItemPlaceholder = () => (
  <Container isPurchased={false} aria-label="Grocery item placeholder">
    <ActionArea>
      <MediaPlaceholder />
      <Content>
        <NamePlaceholder />
      </Content>
    </ActionArea>
    <ActionContainer>
      <ButtonPlaceholder />
      <QuantityDisplayPlaceholder>
        <QuantityPlaceholder />
        <UnitPlaceholder />
      </QuantityDisplayPlaceholder>
      <ButtonPlaceholder />
    </ActionContainer>
  </Container>
);

export default GroceryItemPlaceholder;
