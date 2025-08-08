export interface SwipeableListItemProps {
  children: React.ReactNode;
  onSwipeAction?: () => void;
  onEditAction?: () => void;
  threshold?: number;
  disabled?: boolean;
}

export interface UseHapticFeedbackProps {
  enabled?: boolean;
}

export interface UseSwipeGestureProps {
  disabled?: boolean;
  onSwipeUpdate?: (translateX: number, isDragging: boolean) => void;
  onSwipeEnd?: (translateX: number) => void;
}

export interface UseActionVisibilityProps {
  threshold?: number;
  onAction?: () => void;
  onEditAction?: () => void;
}