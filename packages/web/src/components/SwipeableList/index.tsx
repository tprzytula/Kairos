import { memo, useMemo, useCallback } from "react";
import { SwipeableListItem } from './SwipeableListItem';
import { ISwipeableListProps } from './types';
import { Container } from './index.styled';

const SwipeableList = memo(<T extends { id: string }>({
  component: Component,
  list,
  onSwipeAction,
  onEditAction,
  threshold = 0.3,
}: ISwipeableListProps<T>) => {
  
  const handleSwipeAction = useCallback((id: string) => {
    if (onSwipeAction) {
      onSwipeAction(id);
    }
  }, [onSwipeAction]);

  const handleEditAction = useCallback((id: string) => {
    if (onEditAction) {
      onEditAction(id);
    }
  }, [onEditAction]);

  const memoizedList = useMemo(() => 
    list.map((item) => (
      <SwipeableListItem
        key={item.id}
        onSwipeAction={() => handleSwipeAction(item.id)}
        onEditAction={() => handleEditAction(item.id)}
        threshold={threshold}
      >
        <Component {...item} />
      </SwipeableListItem>
    )), [list, Component, threshold, handleSwipeAction, handleEditAction]
  );

  return (
    <Container>
      {memoizedList}
    </Container>
  );
});

SwipeableList.displayName = 'SwipeableList';

export { ISwipeableListProps } from './types';
export default SwipeableList;
