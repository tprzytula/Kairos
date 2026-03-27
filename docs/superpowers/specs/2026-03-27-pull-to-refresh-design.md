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

A single shared component replaces the four per-route `ScrollableContainer` styled divs. Pull-to-refresh is opt-in via an optional `onRefresh` prop — omitting it gives a plain scroll container, matching current behaviour.

```
src/components/ScrollableContainer/
  index.tsx            — component
  usePullToRefresh.ts  — gesture hook (only active when onRefresh is provided)
  index.styled.tsx     — indicator styled components
```

Each route removes its local `ScrollableContainer` from `index.styled.tsx` and imports the shared component instead, passing `onRefresh` and any route-specific padding via `sx`.

---

### Base styles

The shared component's base CSS:

```ts
{
  display: 'flex',
  flexDirection: 'column',         // required for GroceryList child to stretch correctly
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  overscrollBehavior: 'contain',   // prevents scroll chaining; required for pull gesture
  WebkitOverflowScrolling: 'touch', // iOS momentum scrolling — was present on ShopList, now applied to all
  paddingBottom: '1rem',            // default; overridden per-route via sx
}
```

Per-route `sx` overrides:

| Route | Override |
|---|---|
| GroceryListRoute | none (uses default `paddingBottom: '1rem'`) |
| NoiseTrackingRoute | none (uses default) |
| PlannerRoute | `paddingBottom: '0.5rem'` |
| ShopListRoute | `padding: '0 0.5rem'`, `margin: '0 -0.5rem'` (preserves existing bleed effect) |

---

### `usePullToRefresh(containerRef, onRefresh)`

Attaches native touch event listeners to the container ref — consistent with the existing `useSwipeGesture` hook pattern. Listeners are registered with `{ passive: false }` so `preventDefault()` can be called during an active pull to suppress simultaneous scrolling.

**Activation**: only begins tracking when `containerRef.current.scrollTop === 0` at `touchstart`. Mid-scroll pulls are ignored.

**Pull tracking on `touchmove`**:
- If `deltaY > 0` and `scrollTop === 0`: active pull — calls `preventDefault()`, updates `pullDistance` (capped at threshold)
- If `scrollTop > 0` during an active pull (user scrolled away from top mid-gesture): cancels the gesture, resets `pullDistance` to 0
- If `deltaY ≤ 0`: gesture ignored, normal scroll resumes

**Release on `touchend`**:
- `pullDistance >= threshold (80px)` → sets `isRefreshing: true`, calls `onRefresh()`
  - On resolve: resets state
  - On reject: resets state (no error UI — the individual providers already handle error alerts via `showAlert`)
- `pullDistance < threshold` → snaps back, no refresh triggered

**Threshold**: 80px — matches `MAX_SWIPE_DISTANCE` in `useSwipeGesture`.

**Exposed state**: `pullDistance`, `isPulling`, `isRefreshing`.

**Cleanup**: `useEffect` cleanup removes all listeners to prevent leaks on unmount.

---

### Scroll ancestry

The layout nests multiple scroll containers:
`ApplicationContainer (overflow: hidden)` → `App Content (overflow: auto)` → `StandardLayout Content (overflow: scroll)` → `ScrollableContainer (overflowY: auto)`

`StandardLayout Content` has `overflow: scroll` but in practice never scrolls — its children (the page header, action bar, and `ScrollableContainer`) are sized to fit exactly within it via flexbox constraints. The `ScrollableContainer` is therefore the only element whose `scrollTop` changes during normal use, making the `scrollTop === 0` guard in `usePullToRefresh` reliable. `overscrollBehavior: contain` on `ScrollableContainer` prevents any accidental scroll chaining to outer layers.

---

### Gesture conflict with `useDragToClose`

`useDragToClose` uses the Pointer Events API (`setPointerCapture`) and is used exclusively inside `DraggableBottomDrawer`. When a drawer is open it renders as an overlay covering the `ScrollableContainer`, so touch events naturally hit the drawer rather than the list. No explicit coordination logic is needed.

---

### `ScrollableContainer` props

| Prop | Type | Required |
|---|---|---|
| `children` | `ReactNode` | yes |
| `onRefresh` | `() => Promise<void>` | no |
| `sx` | `SxProps` | no |

---

### Visual behaviour

**While pulling (`isPulling`)**:
- List content translates down by `pullDistance` via `transform: translateY(${pullDistance}px)` with `transition: transform 0.1s`
- Indicator fades in at the top — down arrow that rotates 180° as `pullDistance` approaches threshold

**While refreshing (`isRefreshing`)**:
- Content holds at threshold offset (80px)
- Arrow replaced by MUI `CircularProgress` spinner

**On complete (resolve or reject)**:
- Content animates back to `translateY(0)`
- Indicator fades out

All transitions use CSS `transition` properties — no animation library needed.

---

## Integration points

| Route | `onRefresh` | Notes |
|---|---|---|
| `GroceryListRoute` | `refetchGroceryList` | — |
| `NoiseTrackingRoute` | `refetchNoiseTrackingItems` | — |
| `PlannerRoute` | `refetchToDoList` | — |
| `ShopListRoute` | `fetchShops` | Named asymmetrically to other routes; returns an awaited `Promise<void>`. The `ScrollableContainer` is only rendered when `formMode === 'none'` — `FormContainer` replaces it in add/edit mode. No runtime guard needed; the structural conditional rendering handles it. |

---

## What is removed

The following per-route styled `ScrollableContainer` definitions are deleted:

- `packages/web/src/routes/GroceryListRoute/index.styled.tsx`
- `packages/web/src/routes/NoiseTrackingRoute/index.styled.tsx`
- `packages/web/src/routes/PlannerRoute/index.styled.tsx`
- `packages/web/src/routes/ShopListRoute/index.styled.tsx`

---

## Testing

**`usePullToRefresh`**:
- Ignores gesture when `scrollTop > 0` at `touchstart`
- Cancels active pull when `scrollTop > 0` mid-gesture
- Does not call `onRefresh` when `pullDistance < threshold` on release
- Calls `onRefresh` and sets `isRefreshing` when `pullDistance >= threshold` on release
- Resets state after `onRefresh` resolves
- Resets state after `onRefresh` rejects (no stuck loading state)
- Removes event listeners on unmount

**`ScrollableContainer`**:
- Renders children without `onRefresh` (no indicator rendered)
- Renders indicator element when `onRefresh` is provided
- Applies `sx` overrides to base styles
