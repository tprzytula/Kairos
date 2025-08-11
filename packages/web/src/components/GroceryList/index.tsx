import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useAppState } from '../../providers/AppStateProvider';
import { useGroceryListContext } from '../../providers/GroceryListProvider';
import GroceryItem from '../GroceryItem';
import GroceryItemPlaceholder from '../GroceryItemPlaceholder';
import { Container, EmptyListContainer } from './index.styled';
import { ActionName } from '../../providers/AppStateProvider/enums';
import { Route } from '../../enums/route';
import SwipeableList from '../SwipeableList';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

const PlaceholderComponent = () => (
  <Container>
    {Array.from({ length: 20 }).map((_, index) => (
      <GroceryItemPlaceholder key={index} />
    ))}
  </Container>
)

const EmptyListComponent = () => (
  <EmptyListContainer>
    <ShoppingCartOutlinedIcon aria-label="Empty grocery list" />
  </EmptyListContainer>
)

export const GroceryList = () => {
  const { dispatch } = useAppState()
  const { groceryList, isLoading, removeGroceryItem } = useGroceryListContext();
  const navigate = useNavigate()

  const handleDelete = useCallback((id: string) => {
    removeGroceryItem(id)
    dispatch({
      type: ActionName.CLEAR_PURCHASED_ITEM,
      payload: {
        id,
      },
    })
  }, [removeGroceryItem, dispatch])

  const handleEdit = useCallback((id: string) => {
    navigate(Route.EditGroceryItem.replace(':id', id))
  }, [navigate])

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
        onEditAction={handleEdit}
        threshold={0.3}
      />
    </Container>
  );
};

export default GroceryList;
