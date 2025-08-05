import { SwipeableList as ReactSwipeableList, SwipeableListItem } from "react-swipeable-list";
import { memo, useMemo } from "react";

export interface ISwipeableListProps<T extends { id: string }> {
  component: React.ElementType<any>;
  list: T[];
  trailingActions: (id: string) => React.ReactNode;
  fullSwipe?: boolean;
}

const SwipeableList = memo(<T extends { id: string }>({
  component: Component,
  list,
  trailingActions,
  fullSwipe = true,
}: ISwipeableListProps<T>) => {
  const memoizedList = useMemo(() => 
    list.map((item) => (
      <SwipeableListItem
        key={item.id}
        trailingActions={trailingActions(item.id)}
        fullSwipe={fullSwipe}
        blockSwipe={false}
        threshold={0.25}
      >
        <Component {...item} />
      </SwipeableListItem>
    )), [list, trailingActions, fullSwipe, Component]
  );

  return (
    <ReactSwipeableList 
      threshold={0.25}
    >
      {memoizedList}
    </ReactSwipeableList>
  );
});

SwipeableList.displayName = 'SwipeableList';

export default SwipeableList;
