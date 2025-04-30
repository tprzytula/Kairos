import { useCallback, useRef } from 'react';

/**
 * A hook that returns a throttled version of the provided function.
 * The throttled function will only execute at most once per specified delay period.
 * 
 * @param callback The function to throttle
 * @param delay The minimum time (in milliseconds) that must pass between function calls
 * @returns A throttled version of the callback function
 */
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastCall = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastArgsRef = useRef<Parameters<T> | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCall.current;

      // Store the latest arguments
      lastArgsRef.current = args;

      if (timeSinceLastCall >= delay) {
        // If enough time has passed, execute immediately
        lastCall.current = now;
        callback(...args);
      } else if (!timeoutRef.current) {
        // Only schedule if there isn't already a timeout
        timeoutRef.current = setTimeout(() => {
          if (lastArgsRef.current) {
            lastCall.current = Date.now();
            callback(...lastArgsRef.current);
            timeoutRef.current = null;
            lastArgsRef.current = null;
          }
        }, delay - timeSinceLastCall);
      }
    },
    [callback, delay]
  ) as T;
};
