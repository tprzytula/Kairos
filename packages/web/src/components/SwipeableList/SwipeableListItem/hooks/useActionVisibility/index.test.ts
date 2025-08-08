import { renderHook, act } from '@testing-library/react';
import { useActionVisibility } from './index';

// Mock containerRef
const createMockContainerRef = (offsetWidth: number = 300) => ({
  current: {
    offsetWidth,
    contains: jest.fn(),
  },
});

describe('useActionVisibility', () => {
  beforeEach(() => {
    // Mock document event listeners
    jest.spyOn(document, 'addEventListener');
    jest.spyOn(document, 'removeEventListener');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return initial state and methods', () => {
    const { result } = renderHook(() => useActionVisibility({}));
    
    expect(result.current.isRightActionsVisible).toBe(false);
    expect(result.current.isLeftActionsVisible).toBe(false);
    expect(result.current.updateVisibility).toBeDefined();
    expect(result.current.handleSwipeEnd).toBeDefined();
    expect(result.current.createActionClickHandler).toBeDefined();
    expect(result.current.resetActions).toBeDefined();
    expect(result.current.setupOutsideClickHandler).toBeDefined();
  });

  it('should update visibility based on translateX for both directions', () => {
    const { result } = renderHook(() => useActionVisibility({}));
    
    // Positive translateX below threshold should hide right actions
    act(() => {
      result.current.updateVisibility(3, true);
    });
    expect(result.current.isRightActionsVisible).toBe(false);
    expect(result.current.isLeftActionsVisible).toBe(false);
    
    // Positive translateX above threshold should show right actions
    act(() => {
      result.current.updateVisibility(10, true);
    });
    expect(result.current.isRightActionsVisible).toBe(true);
    expect(result.current.isLeftActionsVisible).toBe(false);

    // Negative translateX below threshold should hide left actions
    act(() => {
      result.current.updateVisibility(-3, true);
    });
    expect(result.current.isRightActionsVisible).toBe(false);
    expect(result.current.isLeftActionsVisible).toBe(false);
    
    // Negative translateX above threshold should show left actions
    act(() => {
      result.current.updateVisibility(-10, true);
    });
    expect(result.current.isRightActionsVisible).toBe(false);
    expect(result.current.isLeftActionsVisible).toBe(true);
  });

  it('should handle swipe end - trigger delete action when positive threshold exceeded', () => {
    const onAction = jest.fn();
    const { result } = renderHook(() => useActionVisibility({ threshold: 0.3, onAction }));
    
    const containerRef = createMockContainerRef(300);
    const translateX = 100; // 100 > 300 * 0.3 = 90
    
    let returnValue: number;
    act(() => {
      returnValue = result.current.handleSwipeEnd(translateX, containerRef as any);
    });
    
    expect(onAction).toHaveBeenCalled();
    expect(result.current.isRightActionsVisible).toBe(false);
    expect(result.current.isLeftActionsVisible).toBe(false);
    expect(returnValue!).toBe(0);
  });

  it('should handle swipe end - trigger edit action when negative threshold exceeded', () => {
    const onEditAction = jest.fn();
    const { result } = renderHook(() => useActionVisibility({ threshold: 0.3, onEditAction }));
    
    const containerRef = createMockContainerRef(300);
    const translateX = -100; // -100 < -90 (negative threshold)
    
    let returnValue: number;
    act(() => {
      returnValue = result.current.handleSwipeEnd(translateX, containerRef as any);
    });
    
    expect(onEditAction).toHaveBeenCalled();
    expect(result.current.isRightActionsVisible).toBe(false);
    expect(result.current.isLeftActionsVisible).toBe(false);
    expect(returnValue!).toBe(0);
  });

  it('should handle swipe end - snap to position when above visibility threshold', () => {
    const onAction = jest.fn();
    const { result } = renderHook(() => useActionVisibility({ threshold: 0.3, onAction }));
    
    const containerRef = createMockContainerRef(300);
    const translateX = 50; // 50 > 32 (visibility threshold) but < 90 (action threshold)
    
    let returnValue: number;
    act(() => {
      returnValue = result.current.handleSwipeEnd(translateX, containerRef as any);
    });
    
    expect(onAction).not.toHaveBeenCalled();
    expect(result.current.isRightActionsVisible || result.current.isLeftActionsVisible).toBe(true);
    expect(returnValue!).toBe(80); // ACTION_BUTTON_WIDTH
  });

  it('should handle swipe end - snap back when below visibility threshold', () => {
    const onAction = jest.fn();
    const { result } = renderHook(() => useActionVisibility({ threshold: 0.3, onAction }));
    
    const containerRef = createMockContainerRef(300);
    const translateX = 20; // 20 < 32 (visibility threshold)
    
    let returnValue: number;
    act(() => {
      returnValue = result.current.handleSwipeEnd(translateX, containerRef as any);
    });
    
    expect(onAction).not.toHaveBeenCalled();
    expect(result.current.isRightActionsVisible).toBe(false);
    expect(result.current.isLeftActionsVisible).toBe(false);
    expect(returnValue!).toBe(0);
  });

  it('should create action click handler that triggers action and resets', () => {
    const onAction = jest.fn();
    const resetTranslateX = jest.fn();
    const { result } = renderHook(() => useActionVisibility({ onAction }));
    
    const clickHandler = result.current.createActionClickHandler(resetTranslateX);
    
    const mockEvent = {
      stopPropagation: jest.fn(),
    } as any;
    
    act(() => {
      clickHandler(mockEvent);
    });
    
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(onAction).toHaveBeenCalled();
    expect(result.current.isRightActionsVisible).toBe(false);
    expect(result.current.isLeftActionsVisible).toBe(false);
    expect(resetTranslateX).toHaveBeenCalled();
  });

  it('should reset actions', () => {
    const { result } = renderHook(() => useActionVisibility({}));
    
    // First make actions visible
    act(() => {
      result.current.updateVisibility(10, true);
    });
    expect(result.current.isRightActionsVisible || result.current.isLeftActionsVisible).toBe(true);
    
    // Then reset
    act(() => {
      result.current.resetActions();
    });
    expect(result.current.isRightActionsVisible).toBe(false);
    expect(result.current.isLeftActionsVisible).toBe(false);
  });

  it('should setup outside click handler when actions are visible', () => {
    const { result } = renderHook(() => useActionVisibility({}));
    
    // Make actions visible first
    act(() => {
      result.current.updateVisibility(10, true);
    });
    
    const containerRef = createMockContainerRef();
    
    let cleanup: (() => void) | undefined;
    act(() => {
      cleanup = result.current.setupOutsideClickHandler(containerRef as any);
    });
    
    expect(document.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    expect(typeof cleanup).toBe('function');
  });

  it('should not setup outside click handler when actions are not visible', () => {
    const { result } = renderHook(() => useActionVisibility({}));
    
    const containerRef = createMockContainerRef();
    
    let cleanup: (() => void) | undefined;
    act(() => {
      cleanup = result.current.setupOutsideClickHandler(containerRef as any);
    });
    
    expect(document.addEventListener).not.toHaveBeenCalled();
    expect(cleanup).toBeUndefined();
  });

  it('should handle outside click and hide actions', () => {
    const { result } = renderHook(() => useActionVisibility({}));
    
    // Make actions visible
    act(() => {
      result.current.updateVisibility(10, true);
    });
    
    const containerRef = createMockContainerRef();
    containerRef.current.contains = jest.fn().mockReturnValue(false);
    
    act(() => {
      result.current.setupOutsideClickHandler(containerRef as any);
    });
    
    // Simulate outside click
    const clickHandler = (document.addEventListener as jest.Mock).mock.calls.find(
      call => call[0] === 'click'
    )[1];
    
    act(() => {
      clickHandler({ target: document.body });
    });
    
    expect(result.current.isRightActionsVisible).toBe(false);
    expect(result.current.isLeftActionsVisible).toBe(false);
  });

  it('should not hide actions on inside click', () => {
    const { result } = renderHook(() => useActionVisibility({}));
    
    // Make actions visible
    act(() => {
      result.current.updateVisibility(10, true);
    });
    
    const containerRef = createMockContainerRef();
    containerRef.current.contains = jest.fn().mockReturnValue(true);
    
    act(() => {
      result.current.setupOutsideClickHandler(containerRef as any);
    });
    
    // Simulate inside click
    const clickHandler = (document.addEventListener as jest.Mock).mock.calls.find(
      call => call[0] === 'click'
    )[1];
    
    act(() => {
      clickHandler({ target: document.body });
    });
    
    expect(result.current.isRightActionsVisible || result.current.isLeftActionsVisible).toBe(true);
  });

  it('should use default threshold when not provided', () => {
    const onAction = jest.fn();
    const { result } = renderHook(() => useActionVisibility({ onAction }));
    
    const containerRef = createMockContainerRef(300);
    const translateX = 95; // 95 > 300 * 0.3 = 90 (default threshold)
    
    act(() => {
      result.current.handleSwipeEnd(translateX, containerRef as any);
    });
    
    expect(onAction).toHaveBeenCalled();
  });

  it('should handle swipe end with null containerRef', () => {
    const onAction = jest.fn();
    const { result } = renderHook(() => useActionVisibility({ threshold: 0.3, onAction }));
    
    const translateX = 100; // Large translateX but no container to measure
    
    let returnValue: number;
    act(() => {
      returnValue = result.current.handleSwipeEnd(translateX, undefined);
    });
    
    // Should still trigger action since translateX > 0 threshold (0 * 0.3 = 0)
    expect(onAction).toHaveBeenCalled();
    expect(returnValue!).toBe(0);
  });

  it('should handle action click when onAction is undefined', () => {
    const { result } = renderHook(() => useActionVisibility({})); // No onAction provided
    
    const resetTranslateX = jest.fn();
    const clickHandler = result.current.createActionClickHandler(resetTranslateX);
    
    const mockEvent = {
      stopPropagation: jest.fn(),
    } as any;
    
    expect(() => {
      act(() => {
        clickHandler(mockEvent);
      });
    }).not.toThrow();
    
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(result.current.isRightActionsVisible).toBe(false);
    expect(result.current.isLeftActionsVisible).toBe(false);
    expect(resetTranslateX).toHaveBeenCalled();
  });
});