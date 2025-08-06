export interface SwipeableListItemProps {
  children: React.ReactNode;
  onSwipeAction?: () => void;
  threshold?: number;
  disabled?: boolean;
}