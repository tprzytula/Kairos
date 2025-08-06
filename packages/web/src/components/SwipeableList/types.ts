export interface ISwipeableListProps<T extends { id: string }> {
  component: React.ElementType<any>;
  list: T[];
  onSwipeAction?: (id: string) => void;
  threshold?: number;
}