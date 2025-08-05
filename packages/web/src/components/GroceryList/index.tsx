import { useCallback } from 'react';
import { useAppState } from '../../providers/AppStateProvider';
import { useGroceryListContext } from '../../providers/GroceryListProvider';
import GroceryItem from '../GroceryItem';
import GroceryItemPlaceholder from '../GroceryItemPlaceholder';
import { Container, DeleteAction, EmptyListContainer, EmptyListMessage } from './index.styled';
import { TrailingActions } from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';
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

  const trailingActions = useCallback((id: string) => (
    <TrailingActions>
      <DeleteAction onClick={() => handleDelete(id)}>
        Delete
      </DeleteAction>
    </TrailingActions>
  ), [handleDelete])

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
        trailingActions={trailingActions}
        fullSwipe={true}
      />
    </Container>
  );
};

export default GroceryList;
