import { useCallback } from 'react';
import { useAppState } from '../../providers/AppStateProvider';
import { useGroceryListContext } from '../../providers/GroceryListProvider';
import GroceryItem from '../GroceryItem';
import GroceryItemPlaceholder from '../GroceryItemPlaceholder';
import { Container, DeleteAction, EmptyListContainer, EmptyListMessage, SwipeableListItemContainer, StyledSwipeableList } from './index.styled';
import { TrailingActions } from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';

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
  const { dispatch } = useAppState()
  const { groceryList, isLoading, removeGroceryItem } = useGroceryListContext();

  const handleDelete = useCallback((id: string) => {
    removeGroceryItem(id)
  }, [removeGroceryItem])

  const trailingActions = useCallback((id: string) => (
    <TrailingActions>
      <DeleteAction onClick={() => handleDelete(id)}>
        Delete
      </DeleteAction>
    </TrailingActions>
  ), [dispatch])

  if (isLoading) {
    return <PlaceholderComponent />
  }

  if (groceryList.length === 0) {
    return <EmptyListComponent />
  }

  return (
    <Container>
      <StyledSwipeableList
        threshold={0.5}
        fullSwipe={true}
      >
        {groceryList.map(({ id, name, quantity, imagePath, unit }) => (
          <SwipeableListItemContainer
            key={id}
            trailingActions={trailingActions(id)}
            fullSwipe={true}
          >
            <GroceryItem 
              key={id} 
              id={id}
              name={name} 
              quantity={quantity} 
              imagePath={imagePath} 
              unit={unit}
            />
          </SwipeableListItemContainer>
        ))}
      </StyledSwipeableList>
    </Container>
  );
};

export default GroceryList;
