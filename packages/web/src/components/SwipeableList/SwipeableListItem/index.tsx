import React, { useRef, useState, useCallback, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { Container, ItemContent, ActionsContainer, ActionButton } from './index.styled';
import { SwipeableListItemProps } from './types';

const ACTION_BUTTON_WIDTH = 80;
const SWIPE_BUFFER = 20;
const MAX_SWIPE_DISTANCE = ACTION_BUTTON_WIDTH + SWIPE_BUFFER;
const VISIBILITY_THRESHOLD = ACTION_BUTTON_WIDTH * 0.4;
const MIN_SWIPE_DETECTION = 5;
const SCROLL_PREVENTION_THRESHOLD = 10;
const HAPTIC_FEEDBACK_THRESHOLD = 0;

export const SwipeableListItem: React.FC<SwipeableListItemProps> = ({
  children,
  onSwipeAction,
  threshold = 0.3,
  disabled = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isActionsVisible, setIsActionsVisible] = useState(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    
    const touch = e.touches[0];
    setStartX(touch.clientX);
    setIsDragging(true);
    
    // Prevent default to avoid scrolling issues
    if (Math.abs(translateX) > MIN_SWIPE_DETECTION) {
      e.preventDefault();
    }
    
    // Add haptic feedback on iOS if available
    if ('vibrate' in navigator && Math.abs(translateX) === HAPTIC_FEEDBACK_THRESHOLD) {
      navigator.vibrate(1);
    }
  }, [disabled, translateX]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || disabled) return;
    
    const touch = e.touches[0];
    const currentX = touch.clientX;
    const deltaX = startX - currentX; // Inverted for right-to-left swipe
    
    // Only allow leftward swipe (revealing actions on the right)
    if (deltaX < 0) {
      setTranslateX(0);
      return;
    }
    
    // Limit swipe distance to action width + some buffer
    const newTranslateX = Math.min(deltaX, MAX_SWIPE_DISTANCE);
    setTranslateX(newTranslateX);
    
    // Show actions when swiping
    setIsActionsVisible(newTranslateX > MIN_SWIPE_DETECTION);
    
    // Prevent scrolling when actively swiping
    if (newTranslateX > SCROLL_PREVENTION_THRESHOLD) {
      e.preventDefault();
    }
  }, [isDragging, startX, disabled]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging || disabled) return;
    
    setIsDragging(false);
    
    const containerWidth = containerRef.current?.offsetWidth || 0;
    const swipeThreshold = containerWidth * threshold;
    
    if (translateX > swipeThreshold && onSwipeAction) {
      // Trigger action
      onSwipeAction();
      setTranslateX(0);
      setIsActionsVisible(false);
    } else if (translateX > VISIBILITY_THRESHOLD) {
      // Keep actions visible
      setTranslateX(ACTION_BUTTON_WIDTH);
      setIsActionsVisible(true);
    } else {
      // Snap back
      setTranslateX(0);
      setIsActionsVisible(false);
    }
  }, [isDragging, translateX, threshold, onSwipeAction, disabled]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    
    setStartX(e.clientX);
    setIsDragging(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const deltaX = startX - e.clientX;
      
      if (deltaX < 0) {
        setTranslateX(0);
        return;
      }
      
      const newTranslateX = Math.min(deltaX, MAX_SWIPE_DISTANCE);
      setTranslateX(newTranslateX);
      setIsActionsVisible(newTranslateX > MIN_SWIPE_DETECTION);
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      
      const containerWidth = containerRef.current?.offsetWidth || 0;
      const swipeThreshold = containerWidth * threshold;
      
      if (translateX > swipeThreshold && onSwipeAction) {
        onSwipeAction();
        setTranslateX(0);
        setIsActionsVisible(false);
      } else if (translateX > VISIBILITY_THRESHOLD) {
        setTranslateX(ACTION_BUTTON_WIDTH);
        setIsActionsVisible(true);
      } else {
        setTranslateX(0);
        setIsActionsVisible(false);
      }
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [disabled, startX, isDragging, translateX, threshold, onSwipeAction]);

  const handleActionClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSwipeAction) {
      onSwipeAction();
    }
    setTranslateX(0);
    setIsActionsVisible(false);
  }, [onSwipeAction]);

  // Reset on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setTranslateX(0);
        setIsActionsVisible(false);
      }
    };

    if (translateX > 0) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [translateX]);

  return (
    <Container 
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
    >
      <ActionsContainer 
        $isVisible={isActionsVisible}
        $translateX={translateX}
      >
        <ActionButton onClick={handleActionClick}>
          <DeleteIcon />
        </ActionButton>
      </ActionsContainer>
      <ItemContent 
        $translateX={-translateX} 
        $isDragging={isDragging}
      >
        {children}
      </ItemContent>
    </Container>
  );
};

export { SwipeableListItemProps } from './types';
export default SwipeableListItem;