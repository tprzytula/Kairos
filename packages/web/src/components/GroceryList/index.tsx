import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useAppState } from '../../providers/AppStateProvider';
import { useGroceryListContext } from '../../providers/GroceryListProvider';
import GroceryItem from '../GroceryItem';
import GroceryItemPlaceholder from '../GroceryItemPlaceholder';
import GroceryCategorySection from '../GroceryCategorySection';
import { GroceryViewMode } from '../../enums/groceryCategory'
import { Container, EmptyListContainer, EmptyStateText } from './index.styled';
import { ActionName } from '../../providers/AppStateProvider/enums';
import { Route } from '../../enums/route';
import SwipeableList from '../SwipeableList';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useGroceryCategories } from '../../hooks/useGroceryCategories';
import { useState } from 'react';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import { Box, IconButton } from '@mui/material';

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
    <EmptyStateText>No grocery items found</EmptyStateText>
    <EmptyStateText>Tap the + button to add your first item</EmptyStateText>
  </EmptyListContainer>
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

  const [allExpanded, setAllExpanded] = useState<boolean>(true)
  const [expandKey, setExpandKey] = useState<number>(0)
  const toggleAll = useCallback(() => {
    setAllExpanded((v) => !v)
    setExpandKey((k) => k + 1)
  }, [])

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

  const effectiveAllExpanded = allExpandedProp ?? allExpanded
  const effectiveExpandKey = expandKeyProp ?? expandKey

  return (
    <Container>
      {allExpandedProp === undefined && (
        <Box display="flex" justifyContent="flex-end" pb={1} pr={0.5}>
          <IconButton aria-label={allExpanded ? 'Collapse all' : 'Expand all'} onClick={toggleAll} size="small">
            {allExpanded ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
          </IconButton>
        </Box>
      )}
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
