import { renderHook, act } from '@testing-library/react';
import { useSwipeGesture } from './index';

// Mock React events
const createMockTouchEvent = (clientX: number, clientY: number = 0): React.TouchEvent => ({
  touches: [{ clientX, clientY }],
  preventDefault: jest.fn(),
} as any);

const createMockMouseEvent = (clientX: number): React.MouseEvent => ({
  clientX,
} as any);

describe('useSwipeGesture', () => {
  beforeEach(() => {
    // Mock document event listeners
    jest.spyOn(document, 'addEventListener');
    jest.spyOn(document, 'removeEventListener');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return initial state and handlers', () => {
    const { result } = renderHook(() => useSwipeGesture());
    
    expect(result.current.translateX).toBe(0);
    expect(result.current.isDragging).toBe(false);
    expect(result.current.containerRef).toBeDefined();
    expect(result.current.setTranslateX).toBeDefined();
    expect(result.current.handlers).toEqual({
      onTouchStart: expect.any(Function),
      onTouchMove: expect.any(Function),
      onTouchEnd: expect.any(Function),
      onMouseDown: expect.any(Function),
    });
  });

  it('should handle touch start correctly', () => {
    const onSwipeUpdate = jest.fn();
    const { result } = renderHook(() => useSwipeGesture({ onSwipeUpdate }));
    
    const touchEvent = createMockTouchEvent(100);
    
    act(() => {
      result.current.handlers.onTouchStart(touchEvent);
    });
    
    expect(result.current.isDragging).toBe(true);
  });

  it('should handle touch move and update translateX', () => {
    const onSwipeUpdate = jest.fn();
    const { result } = renderHook(() => useSwipeGesture({ onSwipeUpdate }));
    
    // Start touch
    act(() => {
      result.current.handlers.onTouchStart(createMockTouchEvent(100));
    });
    
    // Move touch to create leftward swipe
    act(() => {
      result.current.handlers.onTouchMove(createMockTouchEvent(80));
    });
    
    expect(result.current.translateX).toBe(20); // 100 - 80
    expect(onSwipeUpdate).toHaveBeenCalledWith(20, true);
  });

  it('should not allow rightward swipe (negative deltaX)', () => {
    const onSwipeUpdate = jest.fn();
    const { result } = renderHook(() => useSwipeGesture({ onSwipeUpdate }));
    
    // Start touch
    act(() => {
      result.current.handlers.onTouchStart(createMockTouchEvent(100));
    });
    
    // Move touch right (should reset to 0)
    act(() => {
      result.current.handlers.onTouchMove(createMockTouchEvent(120));
    });
    
    expect(result.current.translateX).toBe(0);
  });

  it('should limit swipe distance to MAX_SWIPE_DISTANCE', () => {
    const onSwipeUpdate = jest.fn();
    const { result } = renderHook(() => useSwipeGesture({ onSwipeUpdate }));
    
    // Start touch
    act(() => {
      result.current.handlers.onTouchStart(createMockTouchEvent(200));
    });
    
    // Move touch far left (should be limited to 100)
    act(() => {
      result.current.handlers.onTouchMove(createMockTouchEvent(50));
    });
    
    expect(result.current.translateX).toBe(100); // Limited to MAX_SWIPE_DISTANCE
  });

  it('should handle touch end and call onSwipeEnd', () => {
    const onSwipeEnd = jest.fn();
    const { result } = renderHook(() => useSwipeGesture({ onSwipeEnd }));
    
    // Start and move touch
    act(() => {
      result.current.handlers.onTouchStart(createMockTouchEvent(100));
    });
    
    act(() => {
      result.current.handlers.onTouchMove(createMockTouchEvent(80));
    });
    
    // End touch
    act(() => {
      result.current.handlers.onTouchEnd();
    });
    
    expect(result.current.isDragging).toBe(false);
    expect(onSwipeEnd).toHaveBeenCalledWith(20);
  });

  it('should handle mouse events', () => {
    const onSwipeUpdate = jest.fn();
    const onSwipeEnd = jest.fn();
    const { result } = renderHook(() => useSwipeGesture({ onSwipeUpdate, onSwipeEnd }));
    
    const mouseEvent = createMockMouseEvent(100);
    
    act(() => {
      result.current.handlers.onMouseDown(mouseEvent);
    });
    
    expect(result.current.isDragging).toBe(true);
    expect(document.addEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
    expect(document.addEventListener).toHaveBeenCalledWith('mouseup', expect.any(Function));
  });

  it('should handle mouse move events', () => {
    const onSwipeUpdate = jest.fn();
    const { result } = renderHook(() => useSwipeGesture({ onSwipeUpdate }));
    
    // Start mouse down
    act(() => {
      result.current.handlers.onMouseDown(createMockMouseEvent(100));
    });
    
    // Get the mouse move handler that was registered
    const mouseMoveHandler = (document.addEventListener as jest.Mock).mock.calls.find(
      call => call[0] === 'mousemove'
    )[1];
    
    // Simulate mouse move (leftward swipe)
    act(() => {
      mouseMoveHandler({ clientX: 80 });
    });
    
    expect(result.current.translateX).toBe(20);
    expect(onSwipeUpdate).toHaveBeenCalledWith(20, true);
  });

  it('should handle mouse move with rightward motion (negative delta)', () => {
    const onSwipeUpdate = jest.fn();
    const { result } = renderHook(() => useSwipeGesture({ onSwipeUpdate }));
    
    // Start mouse down
    act(() => {
      result.current.handlers.onMouseDown(createMockMouseEvent(100));
    });
    
    // Get the mouse move handler
    const mouseMoveHandler = (document.addEventListener as jest.Mock).mock.calls.find(
      call => call[0] === 'mousemove'
    )[1];
    
    // Simulate rightward mouse move (should reset to 0)
    act(() => {
      mouseMoveHandler({ clientX: 120 });
    });
    
    expect(result.current.translateX).toBe(0);
  });

  it('should handle mouse up events', () => {
    const onSwipeEnd = jest.fn();
    const { result } = renderHook(() => useSwipeGesture({ onSwipeEnd }));
    
    // Start mouse down and move
    act(() => {
      result.current.handlers.onMouseDown(createMockMouseEvent(100));
    });
    
    const mouseMoveHandler = (document.addEventListener as jest.Mock).mock.calls.find(
      call => call[0] === 'mousemove'
    )[1];
    
    act(() => {
      mouseMoveHandler({ clientX: 80 });
    });
    
    // Get the mouse up handler
    const mouseUpHandler = (document.addEventListener as jest.Mock).mock.calls.find(
      call => call[0] === 'mouseup'
    )[1];
    
    // Simulate mouse up
    act(() => {
      mouseUpHandler({});
    });
    
    expect(result.current.isDragging).toBe(false);
    expect(onSwipeEnd).toHaveBeenCalledWith(20);
    expect(document.removeEventListener).toHaveBeenCalledWith('mousemove', mouseMoveHandler);
    expect(document.removeEventListener).toHaveBeenCalledWith('mouseup', mouseUpHandler);
  });

  it('should not respond when disabled', () => {
    const onSwipeUpdate = jest.fn();
    const { result } = renderHook(() => useSwipeGesture({ disabled: true, onSwipeUpdate }));
    
    act(() => {
      result.current.handlers.onTouchStart(createMockTouchEvent(100));
    });
    
    expect(result.current.isDragging).toBe(false);
    expect(onSwipeUpdate).not.toHaveBeenCalled();
  });

  it('should allow manual translateX updates via setTranslateX', () => {
    const { result } = renderHook(() => useSwipeGesture());
    
    act(() => {
      result.current.setTranslateX(50);
    });
    
    expect(result.current.translateX).toBe(50);
  });

  it('should prevent default on touch events when appropriate', () => {
    const { result } = renderHook(() => useSwipeGesture());
    
    // Set initial translateX > MIN_SWIPE_DETECTION
    act(() => {
      result.current.setTranslateX(10);
    });
    
    const touchEvent = createMockTouchEvent(100);
    
    act(() => {
      result.current.handlers.onTouchStart(touchEvent);
    });
    
    expect(touchEvent.preventDefault).toHaveBeenCalled();
  });

  it('should not handle touch move when not dragging', () => {
    const onSwipeUpdate = jest.fn();
    const { result } = renderHook(() => useSwipeGesture({ onSwipeUpdate }));
    
    // Don't start dragging, just call touch move
    const touchEvent = createMockTouchEvent(80);
    
    act(() => {
      result.current.handlers.onTouchMove(touchEvent);
    });
    
    expect(onSwipeUpdate).not.toHaveBeenCalled();
    expect(result.current.translateX).toBe(0);
  });

  it('should not handle touch end when not dragging', () => {
    const onSwipeEnd = jest.fn();
    const { result } = renderHook(() => useSwipeGesture({ onSwipeEnd }));
    
    // Don't start dragging, just call touch end
    act(() => {
      result.current.handlers.onTouchEnd();
    });
    
    expect(onSwipeEnd).not.toHaveBeenCalled();
  });

  it('should prevent scrolling during large swipe movements', () => {
    const { result } = renderHook(() => useSwipeGesture());
    
    // Start touch
    act(() => {
      result.current.handlers.onTouchStart(createMockTouchEvent(100));
    });
    
    // Create large movement that should prevent scrolling
    const touchEvent = createMockTouchEvent(85); // deltaX = 15 > SCROLL_PREVENTION_THRESHOLD (10)
    
    act(() => {
      result.current.handlers.onTouchMove(touchEvent);
    });
    
    expect(touchEvent.preventDefault).toHaveBeenCalled();
  });

  describe('vertical gesture detection', () => {
    it('should prevent horizontal swiping when vertical movement exceeds threshold', () => {
      const onSwipeUpdate = jest.fn();
      const { result } = renderHook(() => useSwipeGesture({ onSwipeUpdate }));
      
      // Start touch
      act(() => {
        result.current.handlers.onTouchStart(createMockTouchEvent(100, 50));
      });
      
      // Make small horizontal movement with large vertical movement
      act(() => {
        result.current.handlers.onTouchMove(createMockTouchEvent(95, 70)); // deltaX = 5, deltaY = 20 > VERTICAL_THRESHOLD (15)
      });
      
      // Horizontal swipe should be reset to 0
      expect(result.current.translateX).toBe(0);
      expect(onSwipeUpdate).toHaveBeenLastCalledWith(0, true);
    });

    it('should allow horizontal swiping when vertical movement is below threshold', () => {
      const onSwipeUpdate = jest.fn();
      const { result } = renderHook(() => useSwipeGesture({ onSwipeUpdate }));
      
      // Start touch
      act(() => {
        result.current.handlers.onTouchStart(createMockTouchEvent(100, 50));
      });
      
      // Make horizontal movement with small vertical movement
      act(() => {
        result.current.handlers.onTouchMove(createMockTouchEvent(80, 60)); // deltaX = 20, deltaY = 10 < VERTICAL_THRESHOLD (15)
      });
      
      // Horizontal swipe should be allowed
      expect(result.current.translateX).toBe(20);
      expect(onSwipeUpdate).toHaveBeenLastCalledWith(20, true);
    });

    it('should ignore subsequent horizontal movements after vertical gesture is detected', () => {
      const onSwipeUpdate = jest.fn();
      const { result } = renderHook(() => useSwipeGesture({ onSwipeUpdate }));
      
      // Start touch
      act(() => {
        result.current.handlers.onTouchStart(createMockTouchEvent(100, 50));
      });
      
      // First movement: large vertical movement (should trigger vertical gesture)
      act(() => {
        result.current.handlers.onTouchMove(createMockTouchEvent(95, 70)); // deltaY = 20 > threshold
      });
      
      // Second movement: large horizontal movement (should be ignored)
      act(() => {
        result.current.handlers.onTouchMove(createMockTouchEvent(70, 75)); // deltaX = 30, but should be ignored
      });
      
      // Should remain at 0 despite large horizontal movement
      expect(result.current.translateX).toBe(0);
    });

    it('should not trigger onSwipeEnd when gesture was vertical', () => {
      const onSwipeEnd = jest.fn();
      const { result } = renderHook(() => useSwipeGesture({ onSwipeEnd }));
      
      // Start touch
      act(() => {
        result.current.handlers.onTouchStart(createMockTouchEvent(100, 50));
      });
      
      // Make vertical movement
      act(() => {
        result.current.handlers.onTouchMove(createMockTouchEvent(95, 70)); // vertical gesture
      });
      
      // End touch
      act(() => {
        result.current.handlers.onTouchEnd();
      });
      
      // onSwipeEnd should not be called for vertical gestures
      expect(onSwipeEnd).not.toHaveBeenCalled();
    });

    it('should reset vertical gesture state on touch start', () => {
      const onSwipeUpdate = jest.fn();
      const { result } = renderHook(() => useSwipeGesture({ onSwipeUpdate }));
      
      // First gesture: vertical
      act(() => {
        result.current.handlers.onTouchStart(createMockTouchEvent(100, 50));
      });
      
      act(() => {
        result.current.handlers.onTouchMove(createMockTouchEvent(95, 70)); // vertical gesture
      });
      
      act(() => {
        result.current.handlers.onTouchEnd();
      });
      
      // Second gesture: should allow horizontal again
      act(() => {
        result.current.handlers.onTouchStart(createMockTouchEvent(100, 50));
      });
      
      act(() => {
        result.current.handlers.onTouchMove(createMockTouchEvent(80, 55)); // deltaX = 20, deltaY = 5
      });
      
      // Should allow horizontal swipe in new gesture
      expect(result.current.translateX).toBe(20);
    });

    it('should handle simultaneous horizontal and vertical movement correctly', () => {
      const onSwipeUpdate = jest.fn();
      const { result } = renderHook(() => useSwipeGesture({ onSwipeUpdate }));
      
      // Start touch
      act(() => {
        result.current.handlers.onTouchStart(createMockTouchEvent(100, 50));
      });
      
      // Move diagonally - more horizontal than vertical
      act(() => {
        result.current.handlers.onTouchMove(createMockTouchEvent(70, 60)); // deltaX = 30, deltaY = 10
      });
      
      // Should allow horizontal swipe since vertical is below threshold
      expect(result.current.translateX).toBe(30);
      
      // Continue moving more vertically
      act(() => {
        result.current.handlers.onTouchMove(createMockTouchEvent(65, 75)); // deltaY becomes 25 > threshold
      });
      
      // Should reset to 0 when vertical threshold is exceeded
      expect(result.current.translateX).toBe(0);
    });
  });
});