import { memo, useMemo, useCallback } from "react";
import styled from 'styled-components';
import { SwipeableListItem } from './SwipeableListItem';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export interface ISwipeableListProps<T extends { id: string }> {
  component: React.ElementType<any>;
  list: T[];
  onSwipeAction?: (id: string) => void;
  threshold?: number;
}

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

export default SwipeableList;
