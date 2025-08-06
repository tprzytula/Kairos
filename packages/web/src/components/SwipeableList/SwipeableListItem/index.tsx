import React, { useRef, useState, useCallback, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { Container, ItemContent, ActionsContainer, ActionButton } from './index.styled';
import { SwipeableListItemProps } from './types';

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
  const [actionWidth, setActionWidth] = useState(80);
  const [isActionsVisible, setIsActionsVisible] = useState(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    
    const touch = e.touches[0];
    setStartX(touch.clientX);
    setIsDragging(true);
    
    // Prevent default to avoid scrolling issues
    if (Math.abs(translateX) > 5) {
      e.preventDefault();
    }
    
    // Add haptic feedback on iOS if available
    if ('vibrate' in navigator && Math.abs(translateX) === 0) {
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
    const maxSwipe = actionWidth + 20;
    const newTranslateX = Math.min(deltaX, maxSwipe);
    setTranslateX(newTranslateX);
    
    // Show actions when swiping
    setIsActionsVisible(newTranslateX > 5);
    
    // Prevent scrolling when actively swiping
    if (newTranslateX > 10) {
      e.preventDefault();
    }
  }, [isDragging, startX, actionWidth, disabled]);

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
    } else if (translateX > actionWidth * 0.4) {
      // Keep actions visible
      setTranslateX(actionWidth);
      setIsActionsVisible(true);
    } else {
      // Snap back
      setTranslateX(0);
      setIsActionsVisible(false);
    }
  }, [isDragging, translateX, threshold, actionWidth, onSwipeAction, disabled]);

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
      
      const maxSwipe = actionWidth + 20;
      const newTranslateX = Math.min(deltaX, maxSwipe);
      setTranslateX(newTranslateX);
      setIsActionsVisible(newTranslateX > 5);
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      
      const containerWidth = containerRef.current?.offsetWidth || 0;
      const swipeThreshold = containerWidth * threshold;
      
      if (translateX > swipeThreshold && onSwipeAction) {
        onSwipeAction();
        setTranslateX(0);
        setIsActionsVisible(false);
      } else if (translateX > actionWidth * 0.4) {
        setTranslateX(actionWidth);
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
  }, [disabled, startX, isDragging, translateX, threshold, actionWidth, onSwipeAction]);

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