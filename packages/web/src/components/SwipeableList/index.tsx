import { memo, useMemo, useCallback } from "react";
import { SwipeableListItem } from './SwipeableListItem';
import { ISwipeableListProps } from './types';
import { Container } from './index.styled';

const SwipeableList = memo(<T extends { id: string }>({
  component: Component,
  list,
  onSwipeAction,
  threshold = 0.3,
}: ISwipeableListProps<T>) => {
  
  const handleSwipeAction = useCallback((id: string) => {
    if (onSwipeAction) {
      onSwipeAction(id);
    }
  }, [onSwipeAction]);

  const memoizedList = useMemo(() => 
    list.map((item) => (
      <SwipeableListItem
        key={item.id}
        onSwipeAction={() => handleSwipeAction(item.id)}
        threshold={threshold}
      >
        <Component {...item} />
      </SwipeableListItem>
    )), [list, Component, threshold, handleSwipeAction]
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
