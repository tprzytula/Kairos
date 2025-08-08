import { useRef, useState, useCallback } from 'react';
import { UseSwipeGestureProps } from '../../types';

const MIN_SWIPE_DETECTION = 5;
const SCROLL_PREVENTION_THRESHOLD = 10;
const MAX_SWIPE_DISTANCE = 100; // 80 + 20 buffer
const MIN_SWIPE_DISTANCE = -100; // Allow negative for left swipe
const VERTICAL_THRESHOLD = 30; // If vertical movement exceeds this, prioritize scrolling over swiping

export const useSwipeGesture = ({
  disabled = false,
  onSwipeUpdate,
  onSwipeEnd,
}: UseSwipeGestureProps = {}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [translateX, setTranslateX] = useState(0);
  const translateXRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isVerticalGesture, setIsVerticalGesture] = useState(false);

  const updateTranslateX = useCallback((newTranslateX: number, dragging?: boolean) => {
    setTranslateX(newTranslateX);
    translateXRef.current = newTranslateX;
    onSwipeUpdate?.(newTranslateX, dragging ?? isDragging);
  }, [isDragging, onSwipeUpdate]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    
    const touch = e.touches[0];
    setStartX(touch.clientX);
    setStartY(touch.clientY);
    setIsDragging(true);
    setIsVerticalGesture(false);
    
    // Prevent default to avoid scrolling issues
    if (Math.abs(translateX) > MIN_SWIPE_DETECTION) {
      e.preventDefault();
    }
  }, [disabled, translateX]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || disabled) return;
    
    const touch = e.touches[0];
    const currentX = touch.clientX;
    const currentY = touch.clientY;
    const deltaX = startX - currentX; // Inverted for right-to-left swipe
    const deltaY = Math.abs(currentY - startY);
    
    // Check if this is primarily a vertical gesture
    if (!isVerticalGesture && deltaY > VERTICAL_THRESHOLD) {
      setIsVerticalGesture(true);
      updateTranslateX(0);
      return;
    }
    
    // If already determined to be vertical gesture, ignore horizontal movement
    if (isVerticalGesture) {
      return;
    }
    
    // Allow both left and right swipes
    // Limit swipe distance to action width + some buffer in both directions
    const newTranslateX = Math.max(MIN_SWIPE_DISTANCE, Math.min(deltaX, MAX_SWIPE_DISTANCE));
    updateTranslateX(newTranslateX);
    
    // Prevent scrolling when actively swiping horizontally
    if (Math.abs(newTranslateX) > SCROLL_PREVENTION_THRESHOLD) {
      e.preventDefault();
    }
  }, [isDragging, startX, startY, isVerticalGesture, disabled, updateTranslateX]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging || disabled) return;
    
    setIsDragging(false);
    setIsVerticalGesture(false);
    
    // Only trigger swipe end if it wasn't a vertical gesture
    if (!isVerticalGesture) {
      onSwipeEnd?.(translateX);
    }
  }, [isDragging, translateX, onSwipeEnd, disabled, isVerticalGesture]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    
    const mouseStartX = e.clientX;
    setStartX(mouseStartX);
    setIsDragging(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = mouseStartX - e.clientX;
      
      // Allow both left and right swipes for mouse events too
      const newTranslateX = Math.max(MIN_SWIPE_DISTANCE, Math.min(deltaX, MAX_SWIPE_DISTANCE));
      updateTranslateX(newTranslateX, true);
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      onSwipeEnd?.(translateXRef.current);
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [disabled, onSwipeEnd, updateTranslateX]);

  const setTranslateXWithRef = useCallback((newTranslateX: number) => {
    setTranslateX(newTranslateX);
    translateXRef.current = newTranslateX;
  }, []);

  return {
    containerRef,
    translateX,
    isDragging,
    setTranslateX: setTranslateXWithRef,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onMouseDown: handleMouseDown,
    },
  };
};