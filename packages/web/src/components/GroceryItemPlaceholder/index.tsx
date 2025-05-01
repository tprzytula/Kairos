import {
  Container,
  Content,
  NamePlaceholder,
  QuantityContainer,
  QuantityPlaceholder,
  UnitPlaceholder,
  ActionArea,
  MediaPlaceholder,
} from './index.styled';

const GroceryItemPlaceholder = () => (
  <Container isPurchased={false} aria-label="Grocery item placeholder">
    <ActionArea>
      <MediaPlaceholder />
      <Content>
        <NamePlaceholder />
        <QuantityContainer>
          <QuantityPlaceholder />
          <UnitPlaceholder />
        </QuantityContainer>
      </Content>
    </ActionArea>
  </Container>
);

export default GroceryItemPlaceholder;
