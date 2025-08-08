import { renderHook, act } from '@testing-library/react';
import { useHapticFeedback } from './index';

// Mock navigator.vibrate
const mockVibrate = jest.fn();
Object.defineProperty(navigator, 'vibrate', {
  writable: true,
  value: mockVibrate,
});

describe('useHapticFeedback', () => {
  beforeEach(() => {
    mockVibrate.mockClear();
  });

  it('should return triggerFeedback function', () => {
    const { result } = renderHook(() => useHapticFeedback());
    
    expect(result.current).toHaveProperty('triggerFeedback');
    expect(typeof result.current.triggerFeedback).toBe('function');
  });

  it('should trigger vibration with default duration when enabled', () => {
    const { result } = renderHook(() => useHapticFeedback({ enabled: true }));
    
    act(() => {
      result.current.triggerFeedback();
    });
    
    expect(mockVibrate).toHaveBeenCalledWith(1);
  });

  it('should trigger vibration with custom duration', () => {
    const { result } = renderHook(() => useHapticFeedback({ enabled: true }));
    
    act(() => {
      result.current.triggerFeedback(50);
    });
    
    expect(mockVibrate).toHaveBeenCalledWith(50);
  });

  it('should not trigger vibration when disabled', () => {
    const { result } = renderHook(() => useHapticFeedback({ enabled: false }));
    
    act(() => {
      result.current.triggerFeedback();
    });
    
    expect(mockVibrate).not.toHaveBeenCalled();
  });

  it('should default to enabled when no props provided', () => {
    const { result } = renderHook(() => useHapticFeedback());
    
    act(() => {
      result.current.triggerFeedback();
    });
    
    expect(mockVibrate).toHaveBeenCalledWith(1);
  });

  it('should handle missing vibrate API gracefully', () => {
    // Mock navigator.vibrate as a non-function
    const originalVibrate = navigator.vibrate;
    (navigator as any).vibrate = 'not-a-function';
    
    const { result } = renderHook(() => useHapticFeedback({ enabled: true }));
    
    expect(() => {
      act(() => {
        result.current.triggerFeedback();
      });
    }).not.toThrow();
    
    // Restore vibrate
    (navigator as any).vibrate = originalVibrate;
  });
});