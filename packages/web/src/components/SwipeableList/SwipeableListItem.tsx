import React, { useRef, useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import DeleteIcon from '@mui/icons-material/Delete';
import './MobileOptimizations.css';

const Container = styled.div`
  position: relative;
  overflow: hidden;
  touch-action: pan-y;
  will-change: transform;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  overscroll-behavior-x: none;
  background: transparent;
  border-radius: 16px;
  margin: 4px 0;
  isolation: isolate;
`;

const ItemContent = styled.div<{ $translateX: number; $isDragging: boolean }>`
  transform: translate3d(${props => props.$translateX}px, 0, 0);
  transition: ${props => props.$isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'};
  will-change: transform;
  position: relative;
  z-index: 2;
  background: white;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 16px;
  box-shadow: ${props => props.$isDragging ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 6px rgba(0,0,0,0.1)'};
  margin: 0;
  
  @media (prefers-reduced-motion: reduce) {
    transition: none !important;
  }
`;

const ActionsContainer = styled.div<{ $isVisible: boolean; $translateX: number }>`
  position: absolute;
  top: 4px;
  right: 0;
  width: 120px;
  height: calc(100% - 8px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff4444 0%, #cc3333 100%);
  z-index: 1;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: translateX(${props => props.$isVisible ? 0 : '100%'});
  transition: ${props => props.$isVisible ? 'opacity 0.15s ease, transform 0.15s ease' : 'opacity 0.25s ease, transform 0.25s ease'};
  border-radius: 0 16px 16px 0;
  overflow: hidden;
  box-shadow: ${props => props.$isVisible ? 'inset 2px 0 4px rgba(0,0,0,0.15)' : 'none'};
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  padding: 0;
  height: 100%;
  width: 80px;
  cursor: pointer;
  transition: all 0.15s ease;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  margin-right: 12px;
  
  &:hover {
    background: rgba(255,255,255,0.1);
    transform: scale(1.05);
    border-radius: 8px;
  }
  
  &:active {
    background: rgba(255,255,255,0.2);
    transform: scale(0.95);
  }
  
  .MuiSvgIcon-root {
    font-size: 24px;
    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.4));
  }
  
  @media (prefers-color-scheme: dark) {
    color: #ffffff;
  }
  
  @media (prefers-contrast: high) {
    border: 2px solid white;
    
    .MuiSvgIcon-root {
      font-size: 26px;
      font-weight: bold;
    }
  }
`;

interface SwipeableListItemProps {
  children: React.ReactNode;
  onSwipeAction?: () => void;
  threshold?: number;
  disabled?: boolean;
}

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

export default SwipeableListItem;