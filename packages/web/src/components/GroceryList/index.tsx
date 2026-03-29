import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useAppState } from '../../providers/AppStateProvider';
import { useGroceryListContext } from '../../providers/GroceryListProvider';
import { GroceryViewMode } from '../../enums/groceryCategory'
import { ActionName } from '../../providers/AppStateProvider/enums';
import { Route } from '../../enums/route';
import { useGroceryCategories } from '../../hooks/useGroceryCategories';
import UncategorizedView from './UncategorizedView';
import CategorizedView from './CategorizedView';
import PurchasedItemsSection from './PurchasedItemsSection';
import Placeholder from './Placeholder';
import EmptyGroceryList from './EmptyGroceryList';
import { IGroceryListProps } from './types';
import { Container } from './index.styled';

export const GroceryList = ({
  allExpanded = true,
  expandKey = 0,
  shopId
}: IGroceryListProps = {}) => {
  const navigate = useNavigate()
  const { state: { purchasedItems }, dispatch } = useAppState()
  const { groceryList, isLoading, removeGroceryItem, viewMode } = useGroceryListContext();
  const visibleList = useMemo(
    () => groceryList.filter((item) => !purchasedItems.has(item.id)),
    [groceryList, purchasedItems]
  )
  const purchasedList = useMemo(
    () => groceryList.filter((item) => purchasedItems.has(item.id)),
    [groceryList, purchasedItems]
  )
  const { categorizedGroups } = useGroceryCategories(visibleList, viewMode)

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
    const actualShopId = shopId === 'all' ? 'all' : shopId || ''
    navigate(Route.EditGroceryItem.replace(':shopId', actualShopId).replace(':id', id))
  }, [navigate, shopId])

  if (isLoading) {
    return <Placeholder />
  }

  if (groceryList.length === 0) {
    return <EmptyGroceryList />
  }

  if (viewMode === GroceryViewMode.UNCATEGORIZED) {
    return (
      <Container>
        <UncategorizedView
          groceryList={visibleList}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
        <PurchasedItemsSection
          purchasedList={purchasedList}
          allExpanded={allExpanded}
          expandKey={expandKey}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </Container>
    )
  }

  return (
    <Container>
      <CategorizedView
        categorizedGroups={categorizedGroups}
        allExpanded={allExpanded}
        expandKey={expandKey}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
      <PurchasedItemsSection
        purchasedList={purchasedList}
        allExpanded={allExpanded}
        expandKey={expandKey}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </Container>
  );
};

export default GroceryList;
