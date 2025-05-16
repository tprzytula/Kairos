import { SwipeableList as ReactSwipeableList, SwipeableListItem } from "react-swipeable-list";

export interface ISwipeableListProps<T extends { id: string }> {
  component: React.ElementType<any>;
  list: T[];
  trailingActions: (id: string) => React.ReactNode;
  fullSwipe?: boolean;
}

const SwipeableList = <T extends { id: string }>({
  component: Component,
  list,
  trailingActions,
  fullSwipe = true,
}: ISwipeableListProps<T>) => (
  <ReactSwipeableList>
    {list.map((item) => (
      <SwipeableListItem
        key={item.id}
        trailingActions={trailingActions(item.id)}
        fullSwipe={fullSwipe}
      >
        <Component {...item} />
      </SwipeableListItem>
    ))}
  </ReactSwipeableList>
);

export default SwipeableList;
