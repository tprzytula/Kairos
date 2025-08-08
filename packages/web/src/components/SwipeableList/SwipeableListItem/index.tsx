import React, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { Container, ItemContent, ActionsContainer, ActionButton } from './index.styled';
import { SwipeableListItemProps } from './types';
import { useSwipeGesture } from './hooks/useSwipeGesture';
import { useHapticFeedback } from './hooks/useHapticFeedback';
import { useActionVisibility } from './hooks/useActionVisibility';

const HAPTIC_FEEDBACK_THRESHOLD = 0;

export const SwipeableListItem: React.FC<SwipeableListItemProps> = ({
  children,
  onSwipeAction,
  threshold = 0.3,
  disabled = false,
}) => {
  const { triggerFeedback } = useHapticFeedback({ enabled: !disabled });

  const actionVisibility = useActionVisibility({
    threshold,
    onAction: onSwipeAction,
  });

  const {
    containerRef,
    translateX,
    isDragging,
    handlers,
    setTranslateX,
  } = useSwipeGesture({
    disabled,
    onSwipeUpdate: (newTranslateX, newIsDragging) => {
      actionVisibility.updateVisibility(newTranslateX, newIsDragging);
      
      // Trigger haptic feedback on swipe start
      if (Math.abs(newTranslateX) === HAPTIC_FEEDBACK_THRESHOLD && newIsDragging) {
        triggerFeedback(1);
      }
    },
    onSwipeEnd: (endTranslateX) => {
      const newTranslateX = actionVisibility.handleSwipeEnd(endTranslateX, containerRef);
      setTranslateX(newTranslateX);
    },
  });

  // Setup outside click handler that also resets translateX
  React.useEffect(() => {
    const cleanup = actionVisibility.setupOutsideClickHandler(containerRef);
    if (!actionVisibility.isActionsVisible && translateX > 0) {
      setTranslateX(0);
    }
    return cleanup;
  }, [actionVisibility.setupOutsideClickHandler, containerRef, actionVisibility.isActionsVisible, translateX, setTranslateX]);

  return (
    <Container 
      ref={containerRef}
      {...handlers}
    >
      <ActionsContainer 
        $isVisible={actionVisibility.isActionsVisible}
        $translateX={translateX}
      >
        <ActionButton onClick={actionVisibility.createActionClickHandler(() => setTranslateX(0))}>
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