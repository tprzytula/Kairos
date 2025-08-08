import { useState, useCallback } from 'react';
import { UseActionVisibilityProps } from '../../types';

const ACTION_BUTTON_WIDTH = 80;
const VISIBILITY_THRESHOLD = ACTION_BUTTON_WIDTH * 0.4; // 32
const MIN_SWIPE_DETECTION = 5;

export const useActionVisibility = ({
  threshold = 0.3,
  onAction,
}: UseActionVisibilityProps) => {
  const [isActionsVisible, setIsActionsVisible] = useState(false);

  const updateVisibility = useCallback((translateX: number, isDragging: boolean) => {
    // Show actions when swiping
    setIsActionsVisible(translateX > MIN_SWIPE_DETECTION);
  }, []);

  const handleSwipeEnd = useCallback((translateX: number, containerRef?: React.RefObject<HTMLDivElement | null>) => {
    const containerWidth = containerRef?.current?.offsetWidth || 0;
    const swipeThreshold = containerWidth * threshold;
    
    if (translateX > swipeThreshold && onAction) {
      // Trigger action
      onAction();
      setIsActionsVisible(false);
      return 0; // Reset translateX
    } else if (translateX > VISIBILITY_THRESHOLD) {
      // Keep actions visible
      setIsActionsVisible(true);
      return ACTION_BUTTON_WIDTH; // Snap to action width
    } else {
      // Snap back
      setIsActionsVisible(false);
      return 0; // Reset translateX
    }
  }, [threshold, onAction]);

  const createActionClickHandler = useCallback((resetTranslateX: () => void) => {
    return (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onAction) {
        onAction();
      }
      setIsActionsVisible(false);
      resetTranslateX();
    };
  }, [onAction]);

  const setupOutsideClickHandler = useCallback((containerRef: React.RefObject<HTMLDivElement | null>) => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsActionsVisible(false);
      }
    };

    if (isActionsVisible) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isActionsVisible]);

  const resetActions = useCallback(() => {
    setIsActionsVisible(false);
  }, []);

  return {
    isActionsVisible,
    updateVisibility,
    handleSwipeEnd,
    createActionClickHandler,
    resetActions,
    setupOutsideClickHandler,
  };
};