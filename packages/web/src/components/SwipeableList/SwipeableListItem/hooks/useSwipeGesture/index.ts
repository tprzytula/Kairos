import { useRef, useState, useCallback } from 'react';
import { UseSwipeGestureProps } from '../../types';

const MIN_SWIPE_DETECTION = 5;
const SCROLL_PREVENTION_THRESHOLD = 10;
const MAX_SWIPE_DISTANCE = 100; // 80 + 20 buffer

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

  const updateTranslateX = useCallback((newTranslateX: number, dragging?: boolean) => {
    setTranslateX(newTranslateX);
    translateXRef.current = newTranslateX;
    onSwipeUpdate?.(newTranslateX, dragging ?? isDragging);
  }, [isDragging, onSwipeUpdate]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    
    const touch = e.touches[0];
    setStartX(touch.clientX);
    setIsDragging(true);
    
    // Prevent default to avoid scrolling issues
    if (Math.abs(translateX) > MIN_SWIPE_DETECTION) {
      e.preventDefault();
    }
  }, [disabled, translateX]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || disabled) return;
    
    const touch = e.touches[0];
    const currentX = touch.clientX;
    const deltaX = startX - currentX; // Inverted for right-to-left swipe
    
    // Only allow leftward swipe (revealing actions on the right)
    if (deltaX < 0) {
      updateTranslateX(0);
      return;
    }
    
    // Limit swipe distance to action width + some buffer
    const newTranslateX = Math.min(deltaX, MAX_SWIPE_DISTANCE);
    updateTranslateX(newTranslateX);
    
    // Prevent scrolling when actively swiping
    if (newTranslateX > SCROLL_PREVENTION_THRESHOLD) {
      e.preventDefault();
    }
  }, [isDragging, startX, disabled, updateTranslateX]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging || disabled) return;
    
    setIsDragging(false);
    onSwipeEnd?.(translateX);
  }, [isDragging, translateX, onSwipeEnd, disabled]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    
    const mouseStartX = e.clientX;
    setStartX(mouseStartX);
    setIsDragging(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = mouseStartX - e.clientX;
      
      if (deltaX < 0) {
        updateTranslateX(0, true);
        return;
      }
      
      const newTranslateX = Math.min(deltaX, MAX_SWIPE_DISTANCE);
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