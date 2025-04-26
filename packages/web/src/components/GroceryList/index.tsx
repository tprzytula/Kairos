import { useGroceryListContext } from '../../providers/GroceryListProvider';
import GroceryItem from '../GroceryItem';
import GroceryItemPlaceholder from '../GroceryItemPlaceholder';
import { Container, EmptyListContainer, EmptyListMessage } from './index.styled';

const PlaceholderComponent = () => (
  <Container>
    {Array.from({ length: 20 }).map((_, index) => (
      <GroceryItemPlaceholder key={index} />
    ))}
  </Container>
)

const EmptyListComponent = () => (
  <EmptyListContainer>
    <EmptyListMessage>No items in your grocery list</EmptyListMessage>
  </EmptyListContainer>
)

export const GroceryList = () => {
  const { groceryList, isLoading } = useGroceryListContext();

  if (isLoading) {
    return <PlaceholderComponent />
  }

  if (groceryList.length === 0) {
    return <EmptyListComponent />
  }

  return (
    <Container>
      {groceryList.map(({ id, name, quantity, imagePath, unit }) => (
        <GroceryItem 
          key={id} 
          id={id}
          name={name} 
          quantity={quantity} 
          imagePath={imagePath} 
          unit={unit}
        />
      ))}
    </Container>
  );
};

export default GroceryList;
