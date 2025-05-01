import { useGroceryListContext } from '../../providers/GroceryListProvider';
import GroceryItem from '../GroceryItem';
import { Container } from './index.styled';

export const GroceryList = () => {
  const { groceryList } = useGroceryListContext();

  return (
    <Container>
      {groceryList.map(({ id, name, quantity, imagePath, unit }) => (
        <GroceryItem 
          key={id} 
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
