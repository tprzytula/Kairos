# Pull-to-Refresh Design

**Date:** 2026-03-27
**Status:** Approved

---

## Problem

The app now uses optimistic cache updates instead of refetching after mutations. Users have no way to manually sync the list with the server when they want to.

---

## Goal

Add pull-to-refresh to all main list views (Grocery, Noise Tracking, Planner, Shops) with no code duplication.

---

## Architecture

### Shared `ScrollableContainer` component

A single shared component replaces the four near-identical per-route `ScrollableContainer` styled divs. Pull-to-refresh is opt-in via an optional `onRefresh` prop — omitting it gives a plain scroll container, matching current behaviour.

```
src/components/ScrollableContainer/
  index.tsx            — component
  usePullToRefresh.ts  — gesture hook (only active when onRefresh is provided)
  index.styled.tsx     — indicator styled components
```

Each route:
- Removes its local `ScrollableContainer` from `index.styled.tsx`
- Imports the shared component
- Passes `onRefresh` pointing to its provider's refetch function

### `usePullToRefresh(containerRef, onRefresh)`

Attaches native touch event listeners to the container ref — consistent with the existing `useSwipeGesture` and `useDragToClose` hooks. No external library.

**Activation**: only begins tracking when `containerRef.current.scrollTop === 0` at `touchstart`. Mid-scroll pulls are ignored.

**Pull tracking**:
- `deltaY = currentY - startY`
- If `deltaY > 0`: calls `preventDefault()` to suppress container scroll, updates `pullDistance` (capped at threshold)
- If `deltaY ≤ 0`: gesture ignored, normal scroll resumes

**Release**:
- `pullDistance >= threshold` → sets `isRefreshing: true`, calls `onRefresh()`, resets on resolve
- `pullDistance < threshold` → snaps back, no refresh triggered

**Threshold**: 80px — matches `MAX_SWIPE_DISTANCE` in `useSwipeGesture`.

**Exposed state**: `pullDistance`, `isPulling`, `isRefreshing`.

### `ScrollableContainer` component

Styled div (replicating current scroll container CSS: `flex: 1`, `minHeight: 0`, `overflowY: auto`). Accepts:

| Prop | Type | Required |
|---|---|---|
| `children` | `ReactNode` | yes |
| `onRefresh` | `() => Promise<void>` | no |
| `sx` | `SxProps` | no — for route-specific padding |

When `onRefresh` is provided, renders the pull indicator above `children` and translates content downward during pull.

### Visual behaviour

**While pulling (`isPulling`)**:
- List content translates down by `pullDistance` with CSS `transition: transform`
- Indicator fades in at the top showing a down arrow
- Arrow rotates 180° as `pullDistance` approaches threshold — signals the action is ready

**While refreshing (`isRefreshing`)**:
- Content holds at threshold offset (80px)
- Arrow replaced by MUI `CircularProgress` spinner
- On resolve: content animates back to 0, indicator fades out

All transitions use CSS `transition` properties. No animation library required.

---

## Integration points

| Route | Provider refetch |
|---|---|
| `GroceryListRoute` | `refetchGroceryList` from `GroceryListProvider` |
| `NoiseTrackingRoute` | `refetchNoiseTrackingItems` from `NoiseTrackingProvider` |
| `PlannerRoute` | `refetchToDoList` from `PlannerProvider` |
| `ShopListRoute` | `fetchShops` from `ShopProvider` |

---

## What is removed

The following per-route styled `ScrollableContainer` definitions are deleted — replaced by the shared component:

- `packages/web/src/routes/GroceryListRoute/index.styled.tsx`
- `packages/web/src/routes/NoiseTrackingRoute/index.styled.tsx`
- `packages/web/src/routes/PlannerRoute/index.styled.tsx`
- `packages/web/src/routes/ShopListRoute/index.styled.tsx`

---

## Testing

- `usePullToRefresh`: unit tests covering activation guard (scrollTop > 0 ignores gesture), threshold not met (no refresh), threshold met (onRefresh called), reset after resolve
- `ScrollableContainer`: renders children without `onRefresh`; renders indicator when `onRefresh` provided
