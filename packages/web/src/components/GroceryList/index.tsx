import { useCallback } from 'react';
import { useAppState } from '../../providers/AppStateProvider';
import { useGroceryListContext } from '../../providers/GroceryListProvider';
import GroceryItem from '../GroceryItem';
import GroceryItemPlaceholder from '../GroceryItemPlaceholder';
import { Container, EmptyListContainer, EmptyListMessage } from './index.styled';
import { ActionName } from '../../providers/AppStateProvider/enums';
import SwipeableList from '../SwipeableList';

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
    dispatch({
      type: ActionName.CLEAR_PURCHASED_ITEM,
      payload: {
        id,
      },
    })
  }, [removeGroceryItem, dispatch])

  if (isLoading) {
    return <PlaceholderComponent />
  }

  if (groceryList.length === 0) {
    return <EmptyListComponent />
  }

  return (
    <Container>
      <SwipeableList
        component={GroceryItem}
        list={groceryList}
        onSwipeAction={handleDelete}
        threshold={0.3}
      />
    </Container>
  );
};

export default GroceryList;
