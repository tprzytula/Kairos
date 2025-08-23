import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useAppState } from '../../providers/AppStateProvider';
import { useGroceryListContext } from '../../providers/GroceryListProvider';
import GroceryItem from '../GroceryItem';
import GroceryItemPlaceholder from '../GroceryItemPlaceholder';
import GroceryCategorySection from '../GroceryCategorySection';
import { GroceryViewMode } from '../../enums/groceryCategory'
import { Container } from './index.styled';
import EmptyState from '../EmptyState';
import { ActionName } from '../../providers/AppStateProvider/enums';
import { Route } from '../../enums/route';
import SwipeableList from '../SwipeableList';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useGroceryCategories } from '../../hooks/useGroceryCategories';


const PlaceholderComponent = () => (
  <Container>
    {Array.from({ length: 20 }).map((_, index) => (
      <GroceryItemPlaceholder key={index} />
    ))}
  </Container>
)

const EmptyListComponent = () => (
  <EmptyState 
    icon={<ShoppingCartOutlinedIcon aria-label="Empty grocery list" />}
    title="No grocery items found"
    subtitle="Tap the + button to add your first item"
  />
)

type GroceryListProps = {
  allExpanded?: boolean
  expandKey?: number
}

export const GroceryList = ({ allExpanded: allExpandedProp, expandKey: expandKeyProp }: GroceryListProps = {}) => {
  const { dispatch } = useAppState()
  const { groceryList, isLoading, removeGroceryItem, viewMode } = useGroceryListContext();
  const navigate = useNavigate()
  const { categorizedGroups, isUncategorized } = useGroceryCategories(groceryList, viewMode)

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

  if (viewMode === GroceryViewMode.UNCATEGORIZED) {
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
    )
  }

  const effectiveAllExpanded = allExpandedProp ?? true
  const effectiveExpandKey = expandKeyProp ?? 0

  return (
    <Container>
      {categorizedGroups?.map((group) => (
        <GroceryCategorySection
          key={group.category}
          category={group.category}
          categoryLabel={group.label}
          items={group.items}
          onDelete={handleDelete}
          onEdit={handleEdit}
          expandTo={effectiveAllExpanded}
          expandKey={effectiveExpandKey}
        />
      ))}
    </Container>
  );
};

export default GroceryList;
