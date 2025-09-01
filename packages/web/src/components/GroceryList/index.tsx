import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useAppState } from '../../providers/AppStateProvider';
import { useGroceryListContext } from '../../providers/GroceryListProvider';
import { GroceryViewMode } from '../../enums/groceryCategory'
import { ActionName } from '../../providers/AppStateProvider/enums';
import { Route } from '../../enums/route';
import { useGroceryCategories } from '../../hooks/useGroceryCategories';
import UncategorizedView from './UncategorizedView';
import CategorizedView from './CategorizedView';
import Placeholder from './Placeholder';
import EmptyGroceryList from './EmptyGroceryList';
import { IGroceryListProps } from './types';

export const GroceryList = ({
  allExpanded = true,
  expandKey = 0
}: IGroceryListProps = {}) => {
  const navigate = useNavigate()
  const { dispatch } = useAppState()
  const { groceryList, isLoading, removeGroceryItem, viewMode } = useGroceryListContext();
  const { categorizedGroups } = useGroceryCategories(groceryList, viewMode)

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
    return <Placeholder />
  }

  if (groceryList.length === 0) {
    return <EmptyGroceryList />
  }

  if (viewMode === GroceryViewMode.UNCATEGORIZED) {
    return (
      <UncategorizedView
        groceryList={groceryList}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    )
  }

  return (
    <CategorizedView
      categorizedGroups={categorizedGroups}
      allExpanded={allExpanded}
      expandKey={expandKey}
      onDelete={handleDelete}
      onEdit={handleEdit}
    />
  );
};

export default GroceryList;
