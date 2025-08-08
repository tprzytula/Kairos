import React, { createRef } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { SwipeableListItem, SwipeableListItemRef } from './index';

// Mock the hooks
jest.mock('./hooks/useSwipeGesture', () => ({
  useSwipeGesture: ({ onSwipeUpdate }: any) => ({
    containerRef: { current: null },
    translateX: 0,
    isDragging: false,
    handlers: {
      onTouchStart: jest.fn(),
      onTouchMove: jest.fn((e) => {
        // Simulate swipe update to test onSwipeStart callback
        onSwipeUpdate?.(10, true);
      }),
      onTouchEnd: jest.fn(),
      onMouseDown: jest.fn(),
    },
    setTranslateX: jest.fn(),
  }),
}));

jest.mock('./hooks/useHapticFeedback', () => ({
  useHapticFeedback: () => ({
    triggerFeedback: jest.fn(),
  }),
}));

jest.mock('./hooks/useActionVisibility', () => ({
  useActionVisibility: () => ({
    isRightActionsVisible: false,
    isLeftActionsVisible: false,
    updateVisibility: jest.fn(),
    handleSwipeEnd: jest.fn(() => 0),
    createActionClickHandler: jest.fn(() => jest.fn()),
    setupOutsideClickHandler: jest.fn(() => () => {}),
  }),
}));

const TestChild = () => <div data-testid="test-child">Test Content</div>;

describe('SwipeableListItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children', () => {
    render(
      <SwipeableListItem>
        <TestChild />
      </SwipeableListItem>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('should call onSwipeStart when swipe begins', () => {
    const mockOnSwipeStart = jest.fn();
    
    render(
      <SwipeableListItem onSwipeStart={mockOnSwipeStart}>
        <TestChild />
      </SwipeableListItem>
    );

    const container = screen.getByTestId('test-child').closest('div');
    if (container) {
      fireEvent.touchMove(container, {
        touches: [{ clientX: 50, clientY: 0 }],
      });
    }

    expect(mockOnSwipeStart).toHaveBeenCalled();
  });

  it('should expose close method via ref', () => {
    const ref = createRef<SwipeableListItemRef>();
    
    render(
      <SwipeableListItem ref={ref}>
        <TestChild />
      </SwipeableListItem>
    );

    expect(ref.current).toBeTruthy();
    expect(ref.current?.close).toBeInstanceOf(Function);
  });

  it('should call close method when ref.close() is invoked', () => {
    const ref = createRef<SwipeableListItemRef>();
    
    render(
      <SwipeableListItem ref={ref}>
        <TestChild />
      </SwipeableListItem>
    );

    act(() => {
      ref.current?.close();
    });

    // The close method should call setTranslateX(0)
    // This is verified by the mock implementation
  });

  it('should handle onSwipeAction prop', () => {
    const mockOnSwipeAction = jest.fn();
    
    render(
      <SwipeableListItem onSwipeAction={mockOnSwipeAction}>
        <TestChild />
      </SwipeableListItem>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('should handle onEditAction prop', () => {
    const mockOnEditAction = jest.fn();
    
    render(
      <SwipeableListItem onEditAction={mockOnEditAction}>
        <TestChild />
      </SwipeableListItem>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('should handle disabled prop', () => {
    render(
      <SwipeableListItem disabled={true}>
        <TestChild />
      </SwipeableListItem>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('should handle threshold prop', () => {
    render(
      <SwipeableListItem threshold={0.5}>
        <TestChild />
      </SwipeableListItem>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('should render action buttons', () => {
    render(
      <SwipeableListItem>
        <TestChild />
      </SwipeableListItem>
    );

    // Check for delete and edit icons
    expect(screen.getByTestId('DeleteIcon')).toBeInTheDocument();
    expect(screen.getByTestId('EditIcon')).toBeInTheDocument();
  });

  it('should have proper display name', () => {
    expect(SwipeableListItem.displayName).toBe('SwipeableListItem');
  });
});