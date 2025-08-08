import { memo, useMemo, useCallback, useRef } from "react";
import { SwipeableListItem, SwipeableListItemRef } from './SwipeableListItem';
import { ISwipeableListProps } from './types';
import { Container } from './index.styled';

const SwipeableList = memo(<T extends { id: string }>({
  component: Component,
  list,
  onSwipeAction,
  onEditAction,
  threshold = 0.3,
}: ISwipeableListProps<T>) => {
  
  const itemRefs = useRef<Map<string, SwipeableListItemRef>>(new Map());
  
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

  const handleSwipeStart = useCallback((itemId: string) => {
    // Close all other items when one starts swiping
    itemRefs.current.forEach((ref, id) => {
      if (id !== itemId) {
        ref.close();
      }
    });
  }, []);

  const memoizedList = useMemo(() => 
    list.map((item) => (
      <SwipeableListItem
        key={item.id}
        ref={(ref) => {
          if (ref) {
            itemRefs.current.set(item.id, ref);
          } else {
            itemRefs.current.delete(item.id);
          }
        }}
        onSwipeAction={() => handleSwipeAction(item.id)}
        onEditAction={() => handleEditAction(item.id)}
        onSwipeStart={() => handleSwipeStart(item.id)}
        threshold={threshold}
      >
        <Component {...item} />
      </SwipeableListItem>
    )), [list, Component, threshold, handleSwipeAction, handleEditAction, handleSwipeStart]
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
