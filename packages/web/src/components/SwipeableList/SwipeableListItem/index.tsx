import React, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Container, ItemContent, RightActionsContainer, LeftActionsContainer, RightActionButton, LeftActionButton } from './index.styled';
import { SwipeableListItemProps } from './types';
import { useSwipeGesture } from './hooks/useSwipeGesture';
import { useHapticFeedback } from './hooks/useHapticFeedback';
import { useActionVisibility } from './hooks/useActionVisibility';

const HAPTIC_FEEDBACK_THRESHOLD = 0;

export const SwipeableListItem: React.FC<SwipeableListItemProps> = ({
  children,
  onSwipeAction,
  onEditAction,
  threshold = 0.3,
  disabled = false,
}) => {
  const { triggerFeedback } = useHapticFeedback({ enabled: !disabled });

  const actionVisibility = useActionVisibility({
    threshold,
    onAction: onSwipeAction,
    onEditAction,
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
    if (!actionVisibility.isRightActionsVisible && !actionVisibility.isLeftActionsVisible && translateX !== 0) {
      setTranslateX(0);
    }
    return cleanup;
  }, [actionVisibility.setupOutsideClickHandler, containerRef, actionVisibility.isRightActionsVisible, actionVisibility.isLeftActionsVisible, translateX, setTranslateX]);

  return (
    <Container 
      ref={containerRef}
      {...handlers}
    >
      <LeftActionsContainer 
        $isVisible={actionVisibility.isLeftActionsVisible}
        $translateX={translateX}
      >
        <LeftActionButton onClick={actionVisibility.createActionClickHandler(() => setTranslateX(0), true)}>
          <EditIcon />
        </LeftActionButton>
      </LeftActionsContainer>
      <RightActionsContainer 
        $isVisible={actionVisibility.isRightActionsVisible}
        $translateX={translateX}
      >
        <RightActionButton onClick={actionVisibility.createActionClickHandler(() => setTranslateX(0), false)}>
          <DeleteIcon />
        </RightActionButton>
      </RightActionsContainer>
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