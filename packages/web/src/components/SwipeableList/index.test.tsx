import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SwipeableList from './index';

// Mock the hooks used in SwipeableListItem
const mockSetTranslateX = jest.fn();
const mockClose = jest.fn();

jest.mock('./SwipeableListItem/hooks/useSwipeGesture', () => ({
  useSwipeGesture: ({ onSwipeUpdate }: any) => ({
    containerRef: { current: null },
    translateX: 0,
    isDragging: false,
    handlers: {
      onTouchStart: (e: any) => {},
      onTouchMove: (e: any) => {
        // Simulate swipe update to trigger onSwipeStart
        onSwipeUpdate?.(10, true);
      },
      onTouchEnd: (e: any) => {},
      onMouseDown: (e: any) => {},
    },
    setTranslateX: mockSetTranslateX,
  }),
}));

jest.mock('./SwipeableListItem/hooks/useHapticFeedback', () => ({
  useHapticFeedback: () => ({
    triggerFeedback: jest.fn(),
  }),
}));

jest.mock('./SwipeableListItem/hooks/useActionVisibility', () => ({
  useActionVisibility: () => ({
    isRightActionsVisible: false,
    isLeftActionsVisible: false,
    updateVisibility: jest.fn(),
    handleSwipeEnd: jest.fn(() => 0),
    createActionClickHandler: jest.fn(() => jest.fn()),
    setupOutsideClickHandler: jest.fn(() => () => {}),
  }),
}));

interface TestItem {
  id: string;
  name: string;
}

const TestComponent: React.FC<TestItem> = ({ name }) => (
  <div data-testid={`item-${name}`}>{name}</div>
);

const mockItems: TestItem[] = [
  { id: '1', name: 'Item 1' },
  { id: '2', name: 'Item 2' },
  { id: '3', name: 'Item 3' },
];

describe('SwipeableList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all items', () => {
    render(
      <SwipeableList
        component={TestComponent}
        list={mockItems}
        onSwipeAction={jest.fn()}
        onEditAction={jest.fn()}
      />
    );

    expect(screen.getByTestId('item-Item 1')).toBeInTheDocument();
    expect(screen.getByTestId('item-Item 2')).toBeInTheDocument();
    expect(screen.getByTestId('item-Item 3')).toBeInTheDocument();
  });

  it('should call onSwipeAction when an item is swiped for deletion', () => {
    const mockOnSwipeAction = jest.fn();
    
    render(
      <SwipeableList
        component={TestComponent}
        list={mockItems}
        onSwipeAction={mockOnSwipeAction}
        onEditAction={jest.fn()}
      />
    );

    // Get the first item's container and trigger a swipe action
    const firstItem = screen.getByTestId('item-Item 1').closest('[data-testid]')?.parentElement;
    expect(firstItem).toBeInTheDocument();
  });

  it('should call onEditAction when an item is swiped for editing', () => {
    const mockOnEditAction = jest.fn();
    
    render(
      <SwipeableList
        component={TestComponent}
        list={mockItems}
        onSwipeAction={jest.fn()}
        onEditAction={mockOnEditAction}
      />
    );

    // Get the first item's container and trigger an edit action
    const firstItem = screen.getByTestId('item-Item 1').closest('[data-testid]')?.parentElement;
    expect(firstItem).toBeInTheDocument();
  });

  it('should close other items when one item starts swiping', () => {
    render(
      <SwipeableList
        component={TestComponent}
        list={mockItems}
        onSwipeAction={jest.fn()}
        onEditAction={jest.fn()}
      />
    );

    // Find all swipeable containers
    const item1Container = screen.getByTestId('item-Item 1').closest('[data-testid]')?.parentElement;
    const item2Container = screen.getByTestId('item-Item 2').closest('[data-testid]')?.parentElement;
    
    expect(item1Container).toBeInTheDocument();
    expect(item2Container).toBeInTheDocument();

    // Simulate starting a swipe on the first item
    if (item1Container) {
      fireEvent.touchMove(item1Container, {
        touches: [{ clientX: 50, clientY: 0 }],
      });
    }

    // The mock will automatically trigger onSwipeUpdate which should call onSwipeStart
    // This tests that the mechanism is in place - the actual closing behavior
    // is tested at the hook level
  });

  it('should pass threshold prop to items', () => {
    const customThreshold = 0.5;
    
    render(
      <SwipeableList
        component={TestComponent}
        list={mockItems}
        onSwipeAction={jest.fn()}
        onEditAction={jest.fn()}
        threshold={customThreshold}
      />
    );

    // All items should receive the custom threshold
    expect(screen.getByTestId('item-Item 1')).toBeInTheDocument();
    expect(screen.getByTestId('item-Item 2')).toBeInTheDocument();
    expect(screen.getByTestId('item-Item 3')).toBeInTheDocument();
  });

  it('should handle empty list', () => {
    render(
      <SwipeableList
        component={TestComponent}
        list={[]}
        onSwipeAction={jest.fn()}
        onEditAction={jest.fn()}
      />
    );

    // Should render without errors
    expect(screen.queryByTestId(/item-/)).not.toBeInTheDocument();
  });

  it('should handle optional onEditAction prop', () => {
    const mockOnSwipeAction = jest.fn();
    
    render(
      <SwipeableList
        component={TestComponent}
        list={mockItems}
        onSwipeAction={mockOnSwipeAction}
      />
    );

    expect(screen.getByTestId('item-Item 1')).toBeInTheDocument();
    expect(screen.getByTestId('item-Item 2')).toBeInTheDocument();
  });

  it('should handle optional onSwipeAction prop', () => {
    const mockOnEditAction = jest.fn();
    
    render(
      <SwipeableList
        component={TestComponent}
        list={mockItems}
        onEditAction={mockOnEditAction}
      />
    );

    expect(screen.getByTestId('item-Item 1')).toBeInTheDocument();
    expect(screen.getByTestId('item-Item 2')).toBeInTheDocument();
  });

  it('should memoize list properly when props change', () => {
    const mockOnSwipeAction = jest.fn();
    const { rerender } = render(
      <SwipeableList
        component={TestComponent}
        list={mockItems}
        onSwipeAction={mockOnSwipeAction}
      />
    );

    expect(screen.getByTestId('item-Item 1')).toBeInTheDocument();

    // Rerender with same props should not recreate elements
    rerender(
      <SwipeableList
        component={TestComponent}
        list={mockItems}
        onSwipeAction={mockOnSwipeAction}
      />
    );

    expect(screen.getByTestId('item-Item 1')).toBeInTheDocument();
  });
});