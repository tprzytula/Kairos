import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useAppState } from '../../providers/AppStateProvider';
import { useGroceryListContext } from '../../providers/GroceryListProvider';
import GroceryItem from '../GroceryItem';
import GroceryItemPlaceholder from '../GroceryItemPlaceholder';
import CollapsibleSection from '../CollapsibleSection';
import { GroceryViewMode, GroceryCategory } from '../../enums/groceryCategory'
import { Container } from './index.styled';
import EmptyState from '../EmptyState';
import { ActionName } from '../../providers/AppStateProvider/enums';
import { Route } from '../../enums/route';
import SwipeableList from '../SwipeableList';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useGroceryCategories } from '../../hooks/useGroceryCategories';
import { SectionIcon } from '../CollapsibleSection/types';

const CATEGORY_ICON_MAP: Record<GroceryCategory, SectionIcon> = {
  [GroceryCategory.PRODUCE]: { emoji: '🥬', backgroundColor: '#ecfdf5', foregroundColor: '#047857' },
  [GroceryCategory.DAIRY]: { emoji: '🧀', backgroundColor: '#fff7ed', foregroundColor: '#9a3412' },
  [GroceryCategory.MEAT]: { emoji: '🥩', backgroundColor: '#fef2f2', foregroundColor: '#991b1b' },
  [GroceryCategory.FROZEN]: { emoji: '🧊', backgroundColor: '#eff6ff', foregroundColor: '#1d4ed8' },
  [GroceryCategory.BAKERY]: { emoji: '🥖', backgroundColor: '#fffbeb', foregroundColor: '#92400e' },
  [GroceryCategory.PANTRY]: { emoji: '🫘', backgroundColor: '#faf5ff', foregroundColor: '#7e22ce' },
  [GroceryCategory.BEVERAGES]: { emoji: '🧃', backgroundColor: '#f0f9ff', foregroundColor: '#0c4a6e' },
  [GroceryCategory.HOUSEHOLD]: { emoji: '🧻', backgroundColor: '#f8fafc', foregroundColor: '#0f172a' },
  [GroceryCategory.OTHER]: { emoji: '🧺', backgroundColor: '#f4f4f5', foregroundColor: '#374151' },
}

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
        <CollapsibleSection
          key={group.category}
          title={group.label}
          icon={CATEGORY_ICON_MAP[group.category]}
          items={group.items}
          variant="large"
          expandTo={effectiveAllExpanded}
          expandKey={effectiveExpandKey}
        >
          <SwipeableList
            component={GroceryItem}
            list={group.items}
            onSwipeAction={handleDelete}
            onEditAction={handleEdit}
            threshold={0.3}
          />
        </CollapsibleSection>
      ))}
    </Container>
  );
};

export default GroceryList;
