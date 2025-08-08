import { useCallback } from 'react';
import { UseHapticFeedbackProps } from '../../types';

export const useHapticFeedback = ({ enabled = true }: UseHapticFeedbackProps = {}) => {
  const triggerFeedback = useCallback((duration: number = 1) => {
    if (!enabled) return;
    
    // Add haptic feedback on iOS if available
    if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
      navigator.vibrate(duration);
    }
  }, [enabled]);

  return {
    triggerFeedback,
  };
};