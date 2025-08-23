# ActionButtonsBar Component

A reusable component that provides a consistent layout for action buttons across different pages.

## Structure

The component has three sections:
- **Left**: Expand/collapse button
- **Center**: Action button (enabled) or status text (disabled)
- **Right**: View toggle button

## Usage Examples

### Grocery List Style (All sections)
```tsx
<ActionButtonsBar
  expandCollapseButton={{
    isExpanded: allExpanded,
    onToggle: toggleAll,
  }}
  actionButton={{
    isEnabled: purchasedItems.size > 0,
    onClick: removePurchasedItems,
    children: "Remove Purchased Items",
    statusText: "Tap items to mark as purchased",
  }}
  viewToggleButton={{
    children: <ViewModuleIcon />,
    onClick: () => setViewMode(nextMode),
  }}
/>
```

### Todo List Style (Center only)
```tsx
<ActionButtonsBar
  actionButton={{
    isEnabled: selectedTodoItems.size > 0,
    onClick: markToDoItemsAsDone,
    children: "Mark To Do Items As Done",
    statusText: "Tap items to mark as done",
  }}
/>
```

### Noise Tracking Style (Left + Right)
```tsx
<ActionButtonsBar
  expandCollapseButton={{
    isExpanded: areAllGroupsExpanded(),
    onToggle: areAllGroupsExpanded() ? collapseAll : expandAll,
  }}
  viewToggleButton={{
    children: viewMode === 'grouped' ? <ViewModuleIcon /> : <ViewListIcon />,
    onClick: toggleViewMode,
  }}
/>
```

## Features

- ✅ Consistent flex layout across all pages
- ✅ Optional sections - only render what you need
- ✅ Disabled states for all buttons
- ✅ Proper ARIA labels and accessibility
- ✅ Material-UI styling integration
- ✅ TypeScript support with proper interfaces
- ✅ Comprehensive unit tests (100% coverage)

## Props Interface

```typescript
interface IActionButtonsBarProps {
  expandCollapseButton?: {
    isExpanded: boolean
    onToggle: () => void
    disabled?: boolean
  }
  actionButton?: {
    isEnabled: boolean
    onClick: () => void
    children: ReactNode
    statusText?: string
    disabled?: boolean
  }
  viewToggleButton?: {
    children: ReactNode
    onClick: () => void
    disabled?: boolean
  }
}
```
