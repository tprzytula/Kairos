import { useState, useCallback } from 'react';
import { UseActionVisibilityProps } from '../../types';

const ACTION_BUTTON_WIDTH = 80;
const VISIBILITY_THRESHOLD = ACTION_BUTTON_WIDTH * 0.4; // 32
const MIN_SWIPE_DETECTION = 5;

export const useActionVisibility = ({
  threshold = 0.3,
  onAction,
  onEditAction,
}: UseActionVisibilityProps) => {
  const [isRightActionsVisible, setIsRightActionsVisible] = useState(false);
  const [isLeftActionsVisible, setIsLeftActionsVisible] = useState(false);

  const updateVisibility = useCallback((translateX: number, isDragging: boolean) => {
    // Show right actions when swiping left (positive translateX)
    setIsRightActionsVisible(translateX > MIN_SWIPE_DETECTION);
    // Show left actions when swiping right (negative translateX)
    setIsLeftActionsVisible(translateX < -MIN_SWIPE_DETECTION);
  }, []);

  const handleSwipeEnd = useCallback((translateX: number, containerRef?: React.RefObject<HTMLDivElement | null>) => {
    const containerWidth = containerRef?.current?.offsetWidth || 0;
    const swipeThreshold = containerWidth * threshold;
    
    // Handle right swipe (positive translateX) - delete action
    if (translateX > swipeThreshold && onAction) {
      onAction();
      setIsRightActionsVisible(false);
      setIsLeftActionsVisible(false);
      return 0;
    } else if (translateX > VISIBILITY_THRESHOLD) {
      setIsRightActionsVisible(true);
      setIsLeftActionsVisible(false);
      return ACTION_BUTTON_WIDTH;
    }
    // Handle left swipe (negative translateX) - edit action
    else if (translateX < -swipeThreshold && onEditAction) {
      onEditAction();
      setIsRightActionsVisible(false);
      setIsLeftActionsVisible(false);
      return 0;
    } else if (translateX < -VISIBILITY_THRESHOLD) {
      setIsLeftActionsVisible(true);
      setIsRightActionsVisible(false);
      return -ACTION_BUTTON_WIDTH;
    }
    // Snap back to center
    else {
      setIsRightActionsVisible(false);
      setIsLeftActionsVisible(false);
      return 0;
    }
  }, [threshold, onAction, onEditAction]);

  const createActionClickHandler = useCallback((resetTranslateX: () => void, isEditAction = false) => {
    return (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isEditAction && onEditAction) {
        onEditAction();
      } else if (!isEditAction && onAction) {
        onAction();
      }
      setIsRightActionsVisible(false);
      setIsLeftActionsVisible(false);
      resetTranslateX();
    };
  }, [onAction, onEditAction]);

  const setupOutsideClickHandler = useCallback((containerRef: React.RefObject<HTMLDivElement | null>) => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsRightActionsVisible(false);
        setIsLeftActionsVisible(false);
      }
    };

    if (isRightActionsVisible || isLeftActionsVisible) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isRightActionsVisible, isLeftActionsVisible]);

  const resetActions = useCallback(() => {
    setIsRightActionsVisible(false);
    setIsLeftActionsVisible(false);
  }, []);

  return {
    isRightActionsVisible,
    isLeftActionsVisible,
    updateVisibility,
    handleSwipeEnd,
    createActionClickHandler,
    resetActions,
    setupOutsideClickHandler,
  };
};