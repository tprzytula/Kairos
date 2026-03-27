import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePullToRefresh, PULL_THRESHOLD } from './usePullToRefresh'

const createTouchEvent = (clientY: number): TouchEvent =>
  ({ touches: [{ clientY }], preventDefault: vi.fn() } as any)

const makeFakeElement = (scrollTop = 0) => {
  const handlers: Record<string, EventListener> = {}
  return {
    scrollTop,
    addEventListener: vi.fn((event: string, handler: EventListener) => {
      handlers[event] = handler
    }),
    removeEventListener: vi.fn(),
    _handlers: handlers,
  }
}

describe('usePullToRefresh', () => {
  let el: ReturnType<typeof makeFakeElement>
  let containerRef: { current: ReturnType<typeof makeFakeElement> }

  beforeEach(() => {
    vi.useFakeTimers()
    el = makeFakeElement()
    containerRef = { current: el }
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const fire = (event: string, arg?: any) => {
    const handler = el._handlers[event]
    if (handler) act(() => { (handler as any)(arg) })
  }

  it('ignores gesture when scrollTop > 0 at touchstart', () => {
    el.scrollTop = 50
    const onRefresh = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() => usePullToRefresh(containerRef as any, onRefresh))

    fire('touchstart', createTouchEvent(0))
    fire('touchmove', createTouchEvent(60))
    fire('touchend')

    expect(result.current.isPulling).toBe(false)
    expect(result.current.pullDistance).toBe(0)
    expect(onRefresh).not.toHaveBeenCalled()
  })

  it('cancels active pull when scrollTop > 0 mid-gesture', () => {
    const onRefresh = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() => usePullToRefresh(containerRef as any, onRefresh))

    fire('touchstart', createTouchEvent(0))
    fire('touchmove', createTouchEvent(40))
    expect(result.current.isPulling).toBe(true)

    el.scrollTop = 10
    fire('touchmove', createTouchEvent(40))

    expect(result.current.isPulling).toBe(false)
    expect(result.current.pullDistance).toBe(0)
  })

  it('does not call onRefresh when pullDistance < threshold on release', () => {
    const onRefresh = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() => usePullToRefresh(containerRef as any, onRefresh))

    fire('touchstart', createTouchEvent(0))
    fire('touchmove', createTouchEvent(PULL_THRESHOLD - 1))
    fire('touchend')

    expect(result.current.pullDistance).toBe(0)
    expect(onRefresh).not.toHaveBeenCalled()
  })

  it('calls onRefresh and sets isRefreshing when pullDistance >= threshold on release', () => {
    const onRefresh = vi.fn(() => new Promise<void>(() => {}))
    const { result } = renderHook(() => usePullToRefresh(containerRef as any, onRefresh))

    fire('touchstart', createTouchEvent(0))
    fire('touchmove', createTouchEvent(PULL_THRESHOLD))
    fire('touchend')

    expect(onRefresh).toHaveBeenCalledTimes(1)
    expect(result.current.isRefreshing).toBe(true)
    expect(result.current.isPulling).toBe(false)
  })

  it('resets state after onRefresh resolves and min delay elapses', async () => {
    const onRefresh = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() => usePullToRefresh(containerRef as any, onRefresh))

    fire('touchstart', createTouchEvent(0))
    fire('touchmove', createTouchEvent(PULL_THRESHOLD))
    fire('touchend')

    expect(result.current.isRefreshing).toBe(true)

    await act(async () => { vi.advanceTimersByTime(1000) })

    expect(result.current.isRefreshing).toBe(false)
    expect(result.current.pullDistance).toBe(0)
  })

  it('resets state after onRefresh rejects and min delay elapses (no stuck loading state)', async () => {
    const onRefresh = vi.fn().mockRejectedValue(new Error('network error'))
    const { result } = renderHook(() => usePullToRefresh(containerRef as any, onRefresh))

    fire('touchstart', createTouchEvent(0))
    fire('touchmove', createTouchEvent(PULL_THRESHOLD))
    fire('touchend')

    expect(result.current.isRefreshing).toBe(true)

    await act(async () => { vi.advanceTimersByTime(1000) })

    expect(result.current.isRefreshing).toBe(false)
    expect(result.current.pullDistance).toBe(0)
  })

  it('keeps isRefreshing true until both onRefresh resolves and min delay elapses', async () => {
    const onRefresh = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() => usePullToRefresh(containerRef as any, onRefresh))

    fire('touchstart', createTouchEvent(0))
    fire('touchmove', createTouchEvent(PULL_THRESHOLD))
    fire('touchend')

    await act(async () => { vi.advanceTimersByTime(500) })
    expect(result.current.isRefreshing).toBe(true)

    await act(async () => { vi.advanceTimersByTime(500) })
    expect(result.current.isRefreshing).toBe(false)
  })

  it('removes event listeners on unmount', () => {
    const onRefresh = vi.fn().mockResolvedValue(undefined)
    const { unmount } = renderHook(() => usePullToRefresh(containerRef as any, onRefresh))

    unmount()

    expect(el.removeEventListener).toHaveBeenCalledWith('touchstart', expect.any(Function))
    expect(el.removeEventListener).toHaveBeenCalledWith('touchmove', expect.any(Function))
    expect(el.removeEventListener).toHaveBeenCalledWith('touchend', expect.any(Function))
  })

  it('does not attach listeners when onRefresh is not provided', () => {
    renderHook(() => usePullToRefresh(containerRef as any, undefined))

    expect(el.addEventListener).not.toHaveBeenCalled()
  })
})
