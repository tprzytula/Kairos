import { renderHook, act } from '@testing-library/react';
import { useThrottle } from './index';

describe('Given the useThrottle hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should execute callback immediately on first call', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useThrottle(callback, 1000));

    act(() => {
      result.current();
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should throttle subsequent calls within delay period', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useThrottle(callback, 1000));

    // First call - should execute immediately
    act(() => {
      result.current();
    });

    // Second call - should be throttled
    act(() => {
      result.current();
    });

    expect(callback).toHaveBeenCalledTimes(1);

    // Fast forward past the delay
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should pass arguments to the callback function', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useThrottle(callback, 1000));

    const testArg1 = 'test';
    const testArg2 = { foo: 'bar' };

    act(() => {
      result.current(testArg1, testArg2);
    });

    expect(callback).toHaveBeenCalledWith(testArg1, testArg2);
  });

  it('should cancel pending timeout on new call', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useThrottle(callback, 1000));

    // First call
    act(() => {
      result.current('first');
    });

    expect(callback).toHaveBeenCalledWith('first');

    // Wait 500ms
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Second call - should not trigger immediate execution or reset timer
    act(() => {
      result.current('second');
    });

    expect(callback).toHaveBeenCalledTimes(1);

    // Wait for the original timeout
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Should execute with the most recent arguments
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith('second');
  });

  it('should handle multiple rapid calls correctly', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useThrottle(callback, 1000));

    // Simulate 5 rapid calls
    for (let i = 0; i < 5; i++) {
      act(() => {
        result.current(i);
      });
    }

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(0);

    // Fast forward past the delay
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith(4);
  });

  it('should update when delay changes', () => {
    const callback = jest.fn();
    const { rerender } = renderHook(
      ({ delay }) => useThrottle(callback, delay),
      { initialProps: { delay: 1000 } }
    );

    // Change delay to 500ms
    rerender({ delay: 500 });

    // The change in delay should not cause immediate execution
    expect(callback).not.toHaveBeenCalled();
  });
});
